import { IsString } from 'class-validator';

export class CreateProductsReplyDTO {
  @IsString()
  readonly content: string;
}
