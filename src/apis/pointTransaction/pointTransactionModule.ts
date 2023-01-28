import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionController } from './pointTransactionController';
import { PointTransactionService } from './pointTransactionService';
import { IamportService } from '../iamport/iamport.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointTransaction, User])],
  controllers: [PointTransactionController],
  providers: [PointTransactionService, IamportService],
})
export class PointTransactionModule {}
