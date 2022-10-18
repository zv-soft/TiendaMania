import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string, type: string)
    {
      const path = join(__dirname, `../../static/resources/${type}`, imageName)

      if(!existsSync(path))
        throw new BadRequestException(`Not product found with image ${imageName}`)

      return path
    }
}
