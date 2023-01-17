import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { ProductsSalesLocationDTO } from 'src/apis/productsSalesLocation/dto/productsSalesLocation.dto';

export class CreateProductsDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsObject()
  readonly productsSalesLocation: ProductsSalesLocationDTO;

  @IsString()
  readonly productsCategoryId: string;

  @IsArray()
  readonly productsTag: string[];
}
