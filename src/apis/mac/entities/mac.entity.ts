import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Mac {
  @PrimaryColumn()
  id: string;
}
