import { IsNumber, IsString } from 'class-validator';

export class CreatePointTransactionDTO {
  @IsString()
  readonly impUid: string;

  @IsNumber()
  readonly amount: number;
}
