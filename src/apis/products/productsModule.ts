import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { ProductsController } from './productsController';
import { ProductsService } from './productsService';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
