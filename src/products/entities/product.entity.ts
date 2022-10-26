
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

import { ProductImage } from ".";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name:'products'
})
export class Product {

  @ApiProperty({ 
    example: '9219bef8-d83c-425e-801d-72881fab819d',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id:string

  @ApiProperty({ 
    example: 'Camisa Rayada Azul L',
    description: 'Product Title'
  })
  @Column('text', {
    unique:true
  })
  title:string

  @ApiProperty()
  @Column('float', {
    default:0
  })
  price:number

  @ApiProperty()
  @Column({
    type:'text',
    nullable: true
  })
  description: string

  @ApiProperty()
  @Column({
    type:'text',
    unique:true
  })
  slug: string

  @ApiProperty()
  @Column({
    type:'int',
    default:0
  })
  stock:number

  @ApiProperty()
  @Column({
    type:'text',
    array:true
  })
  sizes: string[]

  @ApiProperty()
  @Column({
    type:'text'
  })
  gender:string


  @ApiProperty()
  @Column({
    type:'text',
    array:true,
    default:[]
  })
  tags: string[]

  @ApiProperty()
  @OneToMany(
    ()=>ProductImage, 
    (productImage)=> productImage.product,
    {cascade:true, eager:true}
  )
  images?:ProductImage[]

  @ManyToOne(
    ()=>User,
    (user)=>user.products,
    {eager:true}
  )
  user: User

  @BeforeInsert()
  checkSlugInsert(){
    if(!this.slug)
    {
      this.slug = this.title     
    }

    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '')
  }

  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '')
  }
}
