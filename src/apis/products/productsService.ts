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
      // 1??? ????????? ???????????? ??????
      // const result = await this.productsRepository.save({
      //   ...createProductsData,
      // });
      // return result;

      // 2. ????????? ??????????????? ?????? ???????????? ?????? ??? ????????? ????????????
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

      // productTags ["#????????????" , "#?????????", "#?????????"]
      const productsTagsResult = [];
      for (let i = 0; i < productsTag.length; i++) {
        const temp = productsTag[i].replace('#', '');

        // ?????? ????????? ???????????? ???????????????
        const prevTag = await this.productsTagRepository.findOne({
          where: { name: temp },
        });
        // ????????? ????????? ?????? ???
        if (prevTag) {
          productsTagsResult.push(prevTag);
        } else {
          // ????????? ????????? ?????? ???
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
    // 1. ?????? ??????
    // const result = await this.productsRepository.delete({ id });
    // return result.affected ? true : false;

    // 2. ??????????????? - isDeleted
    // this.productsRepository.update({ id }, { deletedAt: true });

    // 3. ??????????????? ?????? ?????? - deletedAt
    // this.productsRepository.update({ id }, { deletedAt: new Date() });

    // 4. ????????? ??????(TypeORM ??????) - softRemove
    // this.productsRepository.softRemove({ id }); // id?????? ?????? ??????

    // 5. ????????? ??????(TypeORM ??????) - softDelete
    const result = await this.productsRepository.softDelete({ id }); // ????????? ???????????? ?????? ??????
    return result.affected ? true : false;
  }

  async checkSoldOut(id: string) {
    const product = await this.getOneProduct(id);
    if (product.isSoldOut) {
      throw new UnprocessableEntityException('?????? ????????? ????????? ???????????????.');
    }
    // if (product.isSoldOut) {
    //   throw new HttpException(
    //     '?????? ????????? ????????? ???????????????.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }
}
