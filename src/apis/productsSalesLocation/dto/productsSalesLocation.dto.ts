import { OmitType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ProductsSalesLocation } from '../entities/productsSalesLocation.entity';

export class ProductsSalesLocationDTO {
  @IsString()
  readonly address: string;

  @IsString()
  readonly addressDetail: string;

  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;

  @IsDate()
  readonly meetingTime: Date;
}
