import { IsString } from 'class-validator';

export class MacDTO {
  @IsString()
  readonly mac: string;
}
