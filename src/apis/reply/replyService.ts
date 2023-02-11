import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsReply } from './entities/productsReply.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsReplyService {
  constructor(
    @InjectRepository(ProductsReply)
    private readonly productsReplyRepository: Repository<ProductsReply>,
  ) {}
}
