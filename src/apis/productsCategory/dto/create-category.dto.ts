import { IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  readonly name: string;
}
