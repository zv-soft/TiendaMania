import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID} from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ){}


  async create(createProductDto: CreateProductDto) {

    try{     

      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product)

      return product;
    }
    catch(error)
    {
      this.handleDBExceptions(error)
    }


    return 'This action adds a new product';
  }

  async findAll(paginationDto:PaginationDto) {

    const {limit=10, offset=0} = paginationDto

    return await this.productRepository.find({
      take:limit,
      skip:offset
      //TODO Relacionesyarn
    })
  }

  async findOne(term: string) {

    let product: Product
    
    term = term.toLowerCase()

    if(isUUID(term))
      product = await this.productRepository.findOneBy({id:term})
    else
    {
      const queryBuilder = this.productRepository.createQueryBuilder()
      product = await queryBuilder.where('lower(title) =:title or slug =:slug',{
        title:term,
        slug:term,
      }).getOne()
    }
      
    if(!product)
      throw new NotFoundException(`Prduct with id ${term} Not Found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try{
      const product = await this.productRepository.preload({
        id:id,
        ...updateProductDto
      })
  
      if(!product)
        throw new NotFoundException(`Prduct with id ${id} Not Found`)
  
      await this.productRepository.save(product)
  
      return {status:'OK', message:`This product with id ${id} update success`};
    }
    catch(error)
    {
      this.handleDBExceptions(error)
    }
   
  }

  async remove(id: string) {

    let product = await this.findOne(id)
    this.productRepository.remove(product)
    return `Delete succesfull`;

  }


  /**
   * This fucntion Handle Error of DB
   * @param error 
   * 
   */
  private handleDBExceptions(error:any)
  {
    if(error.code==='23505')
    {
      throw new BadRequestException(error.detail)
    }
    else{
      this.logger.error(error)
    }
    
    throw new InternalServerErrorException('Unexpected Error, check server Logs')

  }
}
