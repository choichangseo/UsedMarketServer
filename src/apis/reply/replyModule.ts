import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ProductsReply } from './entities/productsReply.entity';
import { ProductsReplyController } from './replyController';
import { ProductsReplyService } from './replyService';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsReply, User])],
  controllers: [ProductsReplyController],
  providers: [ProductsReplyService],
})
export class ProductsReplyModule {}
