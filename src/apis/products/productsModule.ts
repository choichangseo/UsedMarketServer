import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategory } from '../productsCategory/entities/productsCategory.entity';
import { ProductsSalesLocation } from '../productsSalesLocation/entities/productsSalesLocation.entity';
import { ProductsTag } from '../productsTag/entities/productsTag.entity';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/products.entity';
import { ProductsController } from './productsController';
import { ProductsService } from './productsService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductsSalesLocation,
      ProductsCategory,
      ProductsTag,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
