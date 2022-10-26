import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type:'text',
    unique:true
  })
  email: string;

  @Column({
    type:'text',
    select:false
  })
  password: string;

  @Column({
    type:'text'
  })
  fullName: string;

  @Column({
    type:'bool',
    default:true
  })
  isActive: boolean;

  @Column({
    type:'text',
    array:true,
    default:['user']
  })
  roles: string[];


  @OneToMany(
    ()=>Product,
    (product)=>product.user
  )
  products : Product

  @BeforeInsert()
  checkFieldsBeforeInsert(){
      this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate()
  {
    this.checkFieldsBeforeInsert()
  }
}
