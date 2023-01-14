import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllProductCategory() {
    try {
      const result = await this.productsCategoryRepository.find();
      return result;
    } catch (error) {
      throw error.message;
    }
  }

  async deleteProductCategory(id: string) {
    try {
      const result = await this.getOneProductCategory(id);
      if (!result) {
        throw new NotFoundException(`ProductCategory with ID: ${id} not found`);
      } else {
        this.productsCategoryRepository.delete({ ...result });
        return result;
      }
    } catch (error) {
      throw error.message;
    }
  }

  async getOneProductCategory(id: string) {
    try {
      const result = await this.productsCategoryRepository.findOne({
        where: { id },
      });
      if (!result) {
        throw new NotFoundException(`ProductCategory with ID: ${id} not found`);
      }
      return result;
    } catch (error) {
      throw error.message;
    }
  }

  async createProductCategory(productsCategoryData: CreateCategoryDTO) {
    try {
      const result = await this.productsCategoryRepository.save({
        ...productsCategoryData,
      });
      return result;
    } catch (error) {
      throw error.message;
    }
  }

  async updateProductCategory(
    id: string,
    productsCategoryData: CreateCategoryDTO,
  ) {
    try {
      const category = await this.getOneProductCategory(id);
      const duple = this.productsCategoryRepository.exist({
        where: { name: productsCategoryData.name },
      });
      if (!category) {
        throw new NotFoundException(`ProductCategory with ID: ${id} not found`);
      } else if (duple) {
        throw new ForbiddenException(
          `A product name : ${productsCategoryData.name} that already exists.`,
        );
      } else {
        const result = await this.productsCategoryRepository.save({
          ...category,
          ...productsCategoryData,
        });
        return result;
      }
    } catch (error) {
      throw error.message;
    }
  }
}
