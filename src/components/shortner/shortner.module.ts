import { Module } from "@nestjs/common";
import { ShortnerService } from "./shortner.service";
import { ShortnerResolver } from "./shortner.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import shortUrlSchema, { ShortUrl } from "../../models/shorturl.model";
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ShortUrl.name,
        schema: shortUrlSchema,
      },
    ]),
  ],
  providers: [ShortnerResolver, ShortnerService],
})
export class ShortnerModule {}
