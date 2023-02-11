import { Mac } from 'src/apis/mac/entities/mac.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TemplateList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dataDirection: string;

  @Column()
  modbusMemory: string;

  @Column()
  modbusMemoryAddress: string;

  @Column()
  modbusDataScale: string;

  @Column()
  dataTerm: string;

  @Column()
  dataName: string;

  @Column()
  dataUnit: string;

  @Column()
  dataUID: string;

  @Column()
  dataPID: string;

  @Column()
  errorCode: string;

  @Column()
  progixUID: string;

  @ManyToOne(() => Mac)
  mac: Mac;
}
