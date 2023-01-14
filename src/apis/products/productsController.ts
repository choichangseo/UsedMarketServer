import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { ProductsService } from './productsService';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProduct() {
    return this.productsService.getAllProduct();
  }

  @Get(':id')
  getOneProduct(@Param('id') id: string) {
    return this.productsService.getOneProduct(id);
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
    console.log(createProductsData);
    return this.productsService.createProduct(createProductsData);
  }
}
