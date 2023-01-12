import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { ProductsCategoryService } from './productsCategoryService';

@Controller('category')
export class ProductsCategoryController {
  constructor(
    private readonly productsCategoryService: ProductsCategoryService,
  ) {}

  @Post()
  createProductCategory(@Body() productsCategoryData: CreateCategoryDTO) {
    return this.productsCategoryService.createProductCategory(
      productsCategoryData,
    );
  }
}
