import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

type ShortUrlDocument = HydratedDocument<ShortUrl>;

@Schema({
  validateBeforeSave: false,
  timestamps: {
    createdAt: true,
  },
})
class ShortUrl {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "users",
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  alias: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  shortUrl: string;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  expirationDate: string;
}

const shortUrlSchema = SchemaFactory.createForClass(ShortUrl);

export default shortUrlSchema;
export { ShortUrlDocument, ShortUrl };
