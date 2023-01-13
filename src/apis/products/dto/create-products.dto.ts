import { IsNumber, IsString } from 'class-validator';

export class CreateProductsDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;
}
