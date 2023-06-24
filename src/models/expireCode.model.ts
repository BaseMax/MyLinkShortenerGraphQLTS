import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

type ExpireCodeDocument = HydratedDocument<ExpireCode>;

@Schema({
  validateBeforeSave: false,
  timestamps: {
    createdAt: true,
  },
})
class ExpireCode {
  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: Number,
  })
  code: number;
}

const expireCodeSchema = SchemaFactory.createForClass(ExpireCode);

expireCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

export default expireCodeSchema;
export { ExpireCodeDocument, ExpireCode };
