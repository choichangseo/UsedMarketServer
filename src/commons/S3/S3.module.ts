import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: S3,
      useFactory: (configService: ConfigService) => {
        return new S3({
          accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3],
})
export class AwsModule {}
