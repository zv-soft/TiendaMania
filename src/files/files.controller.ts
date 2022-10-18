import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers'

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    
    ) {}

  @Get(':type/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName:string,
    @Param('type') type:string
  )
  {
    const path = this.filesService.getStaticProductImage(imageName, type)
    res.sendFile(path)
  }


  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', 
    {
      fileFilter: fileFilter, 
      storage: diskStorage({
        destination:'./static/resources/products',
        filename: fileNamer
      })
    })
  )
  uploadProducFile(@UploadedFile() file: Express.Multer.File){

    if(!file) {
      throw new BadRequestException('Make sure thet the file is an Image')
    }

    const secureURL = `${this.configService.get('HOST_API')}/products/${file.filename}`
    return {status:'OK', secureURL}
  }
}
