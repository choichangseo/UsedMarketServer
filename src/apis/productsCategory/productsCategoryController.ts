import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { ProductsCategoryService } from './productsCategoryService';

@Controller('category')
export class ProductsCategoryController {
  constructor(
    private readonly productsCategoryService: ProductsCategoryService,
  ) {}

  @Get()
  getAllProductCategory() {
    return this.productsCategoryService.getAllProductCategory();
  }

  @Get(':id')
  getOneProductCategory(@Param('id') id: string) {
    return this.productsCategoryService.getOneProductCategory(id);
  }

  @Delete(':id')
  deleteProductCategory(@Param('id') id: string) {
    return this.productsCategoryService.deleteProductCategory(id);
  }

  @Patch(':id')
  async updateProductCategory(
    @Param('id') id: string,
    @Body() productsCategoryData: CreateCategoryDTO,
  ) {
    return this.productsCategoryService.updateProductCategory(
      id,
      productsCategoryData,
    );
  }

  @Post()
  createProductCategory(@Body() productsCategoryData: CreateCategoryDTO) {
    return this.productsCategoryService.createProductCategory(
      productsCategoryData,
    );
  }
}
