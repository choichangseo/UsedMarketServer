import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getAllProduct() {
    const result = await this.productsRepository.find();
    return result;
  }

  async getOneProduct(id: string) {
    const result = await this.productsRepository.findOne({ where: { id } });
    return result;
  }

  async updateProduct(id: string, updateProductData: UpdateProductDTO) {
    const check = await this.getOneProduct(id);
    try {
      if (!check) {
        throw new NotFoundException(`Product with ID: ${id} not found`);
      } else {
        const result = await this.productsRepository.save({
          ...check,
          ...updateProductData,
        });
        return result;
      }
    } catch (error) {
      throw error.message;
    }
  }

  async createProduct(createProductsData: CreateProductsDTO) {
    try {
      const result = await this.productsRepository.save({
        ...createProductsData,
      });
      return result;
    } catch (error) {
      throw error.message;
    }
  }
  async checkSoldOut(id: string) {
    const product = await this.getOneProduct(id);
    if (product.isSoldOut) {
      throw new UnprocessableEntityException('이미 판매가 완료된 상품입니다.');
    }
    // if (product.isSoldOut) {
    //   throw new HttpException(
    //     '이미 판매가 완료된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }
}
