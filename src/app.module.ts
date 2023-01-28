import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/authModule';
import { PointTransactionModule } from './apis/pointTransaction/pointTransactionModule';
import { ProductsModule } from './apis/products/productsModule';
import { ProductsCategoryModule } from './apis/productsCategory/productsCategoryModule';
import { UserModule } from './apis/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './commons/typeorm.config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ProductsCategoryModule,
    ProductsModule,
    UserModule,
    AuthModule,
    PointTransactionModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
