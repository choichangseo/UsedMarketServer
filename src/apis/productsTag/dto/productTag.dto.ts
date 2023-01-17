import { IsArray, IsObject, IsString } from 'class-validator';
import { ProductsTag } from '../entities/productsTag.entity';

export class ProductsTagsDTO {
  @IsObject()
  readonly productsTag: ProductsTag;
}
