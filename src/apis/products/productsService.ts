import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsCategory } from '../productsCategory/entities/productsCategory.entity';
import { ProductsSalesLocation } from '../productsSalesLocation/entities/productsSalesLocation.entity';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductsSalesLocation)
    private readonly productsSalesLocationRepository: Repository<ProductsSalesLocation>,
    @InjectRepository(ProductsCategory)
    private readonly productsCategoryRepository: Repository<ProductsCategory>,
  ) {}

  async getAllProduct() {
    const result = await this.productsRepository.find({
      relations: ['productsSalesLocation', 'productsCategory'],
    });
    return result;
  }

  async getOneProduct(id: string) {
    const result = await this.productsRepository.findOne({
      where: { id },
      relations: ['productsSalesLocation', 'productsCategory'],
    });
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
      // 1번 상품만 등록하는 경우
      // const result = await this.productsRepository.save({
      //   ...createProductsData,
      // });
      // return result;

      // 2. 상품과 거래위치를 같이 등록하는 경우 및 다대일 카테고리
      const { productsSalesLocation, productsCategoryId, ...productsData } =
        createProductsData;

      const salesLocationResult =
        await this.productsSalesLocationRepository.save({
          ...productsSalesLocation,
        });
      const productsCategoryResult =
        await this.productsCategoryRepository.findOne({
          where: { id: productsCategoryId },
        });
      return await this.productsRepository.save({
        ...productsData,
        productsSalesLocation: salesLocationResult,
        productsCategory: productsCategoryResult,
      });
    } catch (error) {
      throw error.message;
    }
  }

  async deleteProduct(id: string) {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id });
    // return result.affected ? true : false;

    // 2. 소프트삭제 - isDeleted
    // this.productsRepository.update({ id }, { deletedAt: true });

    // 3. 소프트삭제 날짜 입력 - deletedAt
    // this.productsRepository.update({ id }, { deletedAt: new Date() });

    // 4. 소프트 삭제(TypeORM 제공) - softRemove
    // this.productsRepository.softRemove({ id }); // id로만 삭제 가능

    // 5. 소프트 삭제(TypeORM 제공) - softDelete
    const result = await this.productsRepository.softDelete({ id }); // 다양한 조건으로 삭제 가능
    return result.affected ? true : false;
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
