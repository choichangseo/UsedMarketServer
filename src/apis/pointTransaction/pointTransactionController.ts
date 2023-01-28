import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { CurrentUser } from 'src/commons/auth/rest-user.param';
import { AuthUser } from 'src/commons/type/type';
import { IamportService } from '../iamport/iamport.service';
import { CreatePointTransactionDTO } from './dto/create-pointTransaction.dto';
import { RefundPointTransactionDTO } from './dto/refund-pointTransaction.dto';
import { POINT_TRANSACTION_STATUS_ENUM } from './entities/pointTransaction.entity';
import { PointTransactionService } from './pointTransactionService';

@Controller('payment')
export class PointTransactionController {
  constructor(
    private readonly pointTransactionService: PointTransactionService,
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(AuthGuard('userGuard'))
  @Post()
  async createPointTransaction(
    @Body() createPointData: CreatePointTransactionDTO,
    @CurrentUser() currentUser: AuthUser,
  ) {
    // 검증 로직
    // 아임포트 토큰 발급
    const IamPortToken = await this.iamportService.getToken();
    // 1. 아임포트에 요청해서 결제 완료 기록이 있는지 조회
    await this.iamportService.checkPaid({
      impUid: createPointData.impUid,
      token: IamPortToken,
      amount: createPointData.amount,
    });

    // 2. pointTransaction 테이블에는 impUid가 1개만 존재해야함.(중복 결제 체크)
    await this.pointTransactionService.checkDuple({
      impUid: createPointData.impUid,
    });
    const status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT;
    return this.pointTransactionService.createPointTransaction(
      createPointData,
      currentUser,
      status,
    );
  }

  @UseGuards(AuthGuard('userGuard'))
  @Post('/refund')
  async cancelPayment(
    @Body() refundPointData: RefundPointTransactionDTO,
    @CurrentUser() currentUser: AuthUser,
  ) {
    // 아임포트 토큰 발급
    // 1. 이미 취소된 건인지 확인
    await this.pointTransactionService.checkAlreadyCancel({
      impUid: refundPointData.impUid,
    });
    // 2. 취소하기에 충분한 포인트 잔액이 남아있는지
    await this.pointTransactionService.checkHasCancelablePoint({
      impUid: refundPointData.impUid,
      currentUser,
    });
    // 3. 아임포트에 취소 요청하기
    const IamPortToken = await this.iamportService.getToken();
    const cancelAmount = await this.iamportService.iamPortPaymentCancel({
      impUid: refundPointData.impUid,
      token: IamPortToken,
    });
    // 4. pointTransaction 테이블에서 결제 취소 등록하기
    return await this.pointTransactionService.cancelTransaction({
      impUid: refundPointData.impUid,
      amount: cancelAmount,
      currentUser,
    });
  }
}
