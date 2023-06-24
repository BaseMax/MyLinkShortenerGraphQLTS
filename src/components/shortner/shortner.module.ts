import { Module } from '@nestjs/common';
import { ShortnerService } from './shortner.service';
import { ShortnerResolver } from './shortner.resolver';

@Module({
  providers: [ShortnerResolver, ShortnerService]
})
export class ShortnerModule {}
