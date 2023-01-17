import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/commons/filter/http-exception.filter';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { ProductsService } from './productsService';
@UseFilters(HttpExceptionFilter)
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProduct() {
    return this.productsService.getAllProduct();
  }

  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    const temp = await this.productsService.getOneProduct(id);
    return temp;
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductData: UpdateProductDTO,
  ) {
    await this.productsService.checkSoldOut(id);
    return await this.productsService.updateProduct(id, updateProductData);
  }

  @Post()
  createProduct(@Body() createProductsData: CreateProductsDTO) {
    return this.productsService.createProduct(createProductsData);
  }
}
