import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';



@Injectable()
export class SeedService {

  constructor(
    private readonly productService:ProductsService,

    @InjectRepository( User )
    private readonly userRepository : Repository<User>
  ){}

  async runSeed() {

    await this.deletaTables()

    const firstUser = await this.insertUsers()

    await this.insertNewProduct(firstUser)
 
    return 'Seed Execute';
  }

  private async deletaTables()
  { 
    
    await this.productService.deleteAllProduct()

    const queryBuilder = await this.userRepository.createQueryBuilder('users')
    await queryBuilder
          .delete()
          .where({})
          .execute()

  }

  private async insertUsers()
  {
    const seedUser = initialData.user

    const users:User[] = [];

    seedUser.forEach(user =>{
      users.push(this.userRepository.create(user))
    })

    const __users = await this.userRepository.save(seedUser)

    return __users[0]
  }

  private async insertNewProduct(fisrtUser:User)
  {

    const products = initialData.products

    const insertPromise = []

    products.forEach(product => {
     insertPromise.push(this.productService.create(product, fisrtUser))
    });

    await Promise.all(insertPromise)

    return true


  }

}
