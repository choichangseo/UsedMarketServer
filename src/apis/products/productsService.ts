import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/commons/type/type';
import { Repository } from 'typeorm';
import { ProductsCategory } from '../productsCategory/entities/productsCategory.entity';
import { ProductsSalesLocation } from '../productsSalesLocation/entities/productsSalesLocation.entity';
import { ProductsTag } from '../productsTag/entities/productsTag.entity';
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
    @InjectRepository(ProductsTag)
    private readonly productsTagRepository: Repository<ProductsTag>,
  ) {}

  async getAllProduct() {
    const result = await this.productsRepository.find({
      relations: ['productsSalesLocation', 'productsCategory', 'productsTag'],
    });
    return result;
  }

  async getOneProduct(id: string) {
    const result = await this.productsRepository.findOne({
      where: { id },
      relations: ['productsSalesLocation', 'productsCategory', 'productsTag'],
    });
    return result;
  }

  async updateProduct(id: string, updateProductData: UpdateProductDTO) {
    const check = await this.getOneProduct(id);
    const { productsTag, ...rest } = updateProductData;
    try {
      if (!check) {
        throw new NotFoundException(`Product with ID: ${id} not found`);
      } else {
        const productsTagsResult = [];
        for (let i = 0; i < productsTag.length; i++) {
          const temp = productsTag[i].replace('#', '');

          const prevTag = await this.productsTagRepository.findOne({
            where: { name: temp },
          });

          if (prevTag) {
            productsTagsResult.push(prevTag);
          } else {
            const newTag = await this.productsTagRepository.save({
              name: temp,
            });
            productsTagsResult.push(newTag);
          }
        }
        const result = await this.productsRepository.save({
          ...check,
          ...rest,
          productsTag: productsTagsResult,
        });
        return result;
      }
    } catch (error) {
      throw error.message;
    }
  }

  async createProduct(
    createProductsData: CreateProductsDTO,
    currentUser: AuthUser,
  ) {
    try {
      // 1번 상품만 등록하는 경우
      // const result = await this.productsRepository.save({
      //   ...createProductsData,
      // });
      // return result;

      // 2. 상품과 거래위치를 같이 등록하는 경우 및 다대일 카테고리
      const {
        productsSalesLocation,
        productsCategoryId,
        productsTag,
        ...productsData
      } = createProductsData;

      const salesLocationResult =
        await this.productsSalesLocationRepository.save({
          ...productsSalesLocation,
        });

      const productsCategoryResult =
        await this.productsCategoryRepository.findOne({
          where: { id: productsCategoryId },
        });

      // productTags ["#전자제품" , "#영등포", "#컴퓨터"]
      const productsTagsResult = [];
      for (let i = 0; i < productsTag.length; i++) {
        const temp = productsTag[i].replace('#', '');

        // 이미 등록된 태그인지 확인해보기
        const prevTag = await this.productsTagRepository.findOne({
          where: { name: temp },
        });
        // 기존에 태그가 있을 때
        if (prevTag) {
          productsTagsResult.push(prevTag);
        } else {
          // 기존에 태그가 없을 때
          const newTag = await this.productsTagRepository.save({ name: temp });
          productsTagsResult.push(newTag);
        }
      }
      return await this.productsRepository.save({
        ...productsData,
        productsSalesLocation: salesLocationResult,
        productsCategory: productsCategoryResult,
        productsTag: productsTagsResult,
        userId: currentUser.id,
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
