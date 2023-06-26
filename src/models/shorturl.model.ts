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
  expirationDate: Date;
}

const shortUrlSchema = SchemaFactory.createForClass(ShortUrl);

shortUrlSchema.pre("save", function () {
  const time1 = new Date();
  if (this.expirationDate) {
    const diffInMs = Math.abs((this.expirationDate as any) - (time1 as any));

    const diffInSec = Math.floor(diffInMs / 1000);

    shortUrlSchema.index({ createdAt: 1 }, { expireAfterSeconds: diffInSec });
  }
});

export default shortUrlSchema;
export { ShortUrlDocument, ShortUrl };
