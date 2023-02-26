import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/authModule';
import { FileModule } from './apis/file/file.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransactionModule';
import { ProductsModule } from './apis/products/productsModule';
import { ProductsCategoryModule } from './apis/productsCategory/productsCategoryModule';
import { UserModule } from './apis/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './commons/S3/S3.module';
import { typeORMConfig } from './commons/typeorm.config';
@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ProductsCategoryModule,
    ProductsModule,
    UserModule,
    AuthModule,
    PointTransactionModule,
    FileModule,
    AwsModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
