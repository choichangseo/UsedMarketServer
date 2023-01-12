import { ProductsCategory } from 'src/apis/productsCategory/entities/productsCategory.entity';
import { ProductsSalesLocation } from 'src/apis/productsSalesLocation/entities/productsSalesLocation.entity';
import { ProductsTag } from 'src/apis/productsTag/entities/productsTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  isSoldOut: boolean;
  //   soldedAt: Date;

  @JoinColumn()
  @OneToOne(() => ProductsSalesLocation)
  productsSalesLocation: ProductsSalesLocation;

  @ManyToOne(() => ProductsCategory)
  productsCategory: ProductsCategory;

  @ManyToOne(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => ProductsTag, (productsTag) => productsTag.product)
  productsTag: ProductsTag[];
}
