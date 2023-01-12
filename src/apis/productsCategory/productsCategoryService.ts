import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { ProductsCategory } from './entities/productsCategory.entity';

@Injectable()
export class ProductsCategoryService {
  constructor(
    @InjectRepository(ProductsCategory)
    private productsCategoryRepository: Repository<ProductsCategory>,
  ) {}

  async createProductCategory(productsCategoryData: CreateCategoryDTO) {
    const result = await this.productsCategoryRepository.save({
      ...productsCategoryData,
    });
    return result;
  }
}
