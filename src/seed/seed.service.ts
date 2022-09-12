import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService:ProductsService
  ){}

  runSeed() {

    this.insertNewProduct()

    return 'Seed Execute';
  }

  private async insertNewProduct()
  {
    this.productService.deleteAllProduct()


    const products = initialData.products

    const insertPromise = []

    products.forEach(product => {
     insertPromise.push(this.productService.create(product))
    });

    await Promise.all(insertPromise)

    return true


  }

}
