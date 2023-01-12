import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategoryModule } from './apis/productsCategory/productsCategoryModule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './commons/typeorm.config';

@Module({
  imports: [ProductsCategoryModule, TypeOrmModule.forRoot(typeORMConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
