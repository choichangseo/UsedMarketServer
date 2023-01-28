import { IsString } from 'class-validator';

export class RefundPointTransactionDTO {
  @IsString()
  readonly impUid: string;
}
