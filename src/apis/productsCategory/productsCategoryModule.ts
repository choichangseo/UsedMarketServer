import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategory } from './entities/productsCategory.entity';
import { ProductsCategoryController } from './productsCategoryController';
import { ProductsCategoryService } from './productsCategoryService';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsCategory])],
  controllers: [ProductsCategoryController],
  providers: [ProductsCategoryService],
})
export class ProductsCategoryModule {}
