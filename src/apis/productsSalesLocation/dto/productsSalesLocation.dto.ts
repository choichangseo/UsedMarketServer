import { IsDate, IsNumber, IsString } from 'class-validator';

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
