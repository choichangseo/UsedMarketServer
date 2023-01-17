import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  // 비밀번호 노출 금지
  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  age: number;
}
