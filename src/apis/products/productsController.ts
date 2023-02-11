import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/commons/auth/rest-user.param';
import { HttpExceptionFilter } from 'src/commons/filter/http-exception.filter';
import { AuthUser } from 'src/commons/type/type';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { ProductsService } from './productsService';
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('userGuard'))
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
  createProduct(
    @Body() createProductsData: CreateProductsDTO,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.productsService.createProduct(createProductsData, currentUser);
  }
}
