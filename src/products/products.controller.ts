import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { Auth, GetUser } from "../auth/decorators";
import { ValidRoles } from "../auth/interfaces";
import { User } from "src/auth/entities/user.entity";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Product } from "./entities";


@ApiTags('Products')
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @Auth()
  @ApiResponse({status:201, description:'Product was created', type: Product})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status:403, description:'Forbiden'})
  create(
    @GetUser() user:User,
    @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto) {
    
    return this.productsService.findAll(paginationDto);
  }

  @Auth(ValidRoles.superAdmin)
  @Get(":term")
  findOne(@Param("term") term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(":id")
  @ApiResponse({status:201, description:'Product was created', type: Product})
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
