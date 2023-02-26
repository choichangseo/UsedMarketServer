import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(private readonly s3: S3) {}
  async uploadFile(file) {
    const result = await this.s3
      .putObject({
        Bucket: 'used-market/productimages',
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
    return result;
  }
}
