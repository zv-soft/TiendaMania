import { Module } from '@nestjs/common';

import { ProductsModule } from './../products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  imports:[ProductsModule, AuthModule],
  providers: [SeedService]
})
export class SeedModule {}
