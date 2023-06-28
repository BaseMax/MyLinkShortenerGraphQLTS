import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

type VisitDocuement = HydratedDocument<Visit>;

@Schema({
  validateBeforeSave: false,
  timestamps: {
    createdAt: true,
  },
})
class Visit {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  linkId: string;

  @Prop({
    type: String,
    required: true,
  })
  referrer: string;

  @Prop({
    type: String,
    required: true,
  })
  userAgent: string;

  @Prop({
    type: String,
    required: true,
  })
  ipAddress: string;
}

const visitSchema = SchemaFactory.createForClass(Visit);

export default visitSchema;
export { VisitDocuement, Visit };
