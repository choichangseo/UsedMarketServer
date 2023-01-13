import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsDTO } from './create-products.dto';

export class UpdateProductDTO extends PartialType(CreateProductsDTO) {}

// OmitType 빼고 싶은 타입
// PickType 원하는 타입만 선택
