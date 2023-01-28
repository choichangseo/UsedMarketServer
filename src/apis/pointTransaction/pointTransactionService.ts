import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';
import { Connection, Repository } from 'typeorm';
import { CreatePointTransactionDTO } from './dto/create-pointTransaction.dto';
import { AuthUser } from 'src/commons/type/type';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PointTransactionService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async checkDuple({ impUid }) {
    const result = this.pointTransactionRepository.findOne({
      where: { impUid },
    });
    if (result) throw new ConflictException('이미 결제된 아이디입니다.');
  }

  async checkAlreadyCancel({ impUid }) {
    const pointTransaction = await this.pointTransactionRepository.findOne({
      where: { impUid, status: POINT_TRANSACTION_STATUS_ENUM.CANCEL },
    });
    if (pointTransaction)
      throw new ConflictException('이미 취소된 결제 아이디 입니다.');
  }

  async checkHasCancelablePoint({ impUid, currentUser }) {
    const payment = await this.pointTransactionRepository.findOne({
      where: {
        impUid,
        user: { id: currentUser.id },
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      },
    });
    if (!payment)
      throw new UnprocessableEntityException('결제 기록이 없습니다.');
    const userPoint = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    if (userPoint.point < payment.amount)
      throw new ConflictException('환불 금액보다 포인트가 적습니다.');
  }

  async cancelTransaction({ impUid, amount, currentUser }) {
    const createPointData: CreatePointTransactionDTO = {
      impUid,
      amount: -amount,
    };
    const status = POINT_TRANSACTION_STATUS_ENUM.CANCEL;
    const pointTransaction = await this.createPointTransaction(
      createPointData,
      currentUser,
      status,
    );
    return pointTransaction;
  }

  async createPointTransaction(
    createPointData: CreatePointTransactionDTO,
    currentUser: AuthUser,
    status: POINT_TRANSACTION_STATUS_ENUM,
  ) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    // transaction 시작 !!
    await queryRunner.startTransaction();

    try {
      // 1. pointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid: createPointData.impUid,
        amount: createPointData.amount,
        user: currentUser,
        status,
      });
      await queryRunner.manager.save(pointTransaction); // await this.pointTransactionRepository.save(pointTransaction);

      // 2. 유저의 돈 찾아오기
      const user = await this.userRepository.findOne({
        where: { id: currentUser.id },
      });

      // 3. 유저의 돈 없데이트
      // await this.userRepository.update(
      //   { id: user.id },
      //   { point: user.point + createPointData.amount },
      // );
      const updatedUser = this.userRepository.create({
        ...user,
        point: user.point + createPointData.amount,
      });
      await queryRunner.manager.save(updatedUser); // await this.userRepository.save(updatedUser);

      // 성공 확정(커밋)!!!
      await queryRunner.commitTransaction();

      // 4. 최종결과 프론트엔드에 돌려주기
      return pointTransaction;
    } catch (error) {
      // 롤백 되돌리기
      await queryRunner.rollbackTransaction();
    } finally {
      // 연결 해제(DB에 연결 개수 제한이 있음)
      await queryRunner.release();
    }
  }
}
