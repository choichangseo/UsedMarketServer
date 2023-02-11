import { IsString } from 'class-validator';

export class CreateTemplateListDTO {
  @IsString()
  readonly mac: string;

  @IsString()
  readonly dataDirection: string;

  @IsString()
  readonly modbusMemory: string;

  @IsString()
  readonly modbusMemoryAddress: string;

  @IsString()
  readonly modbusDataScale: string;

  @IsString()
  readonly dataTerm: string;

  @IsString()
  readonly dataName: string;

  @IsString()
  readonly dataUnit: string;

  @IsString()
  readonly dataUID: string;

  @IsString()
  readonly dataPID: string;

  @IsString()
  readonly errorCode: string;

  @IsString()
  readonly progixUID: string;
}
