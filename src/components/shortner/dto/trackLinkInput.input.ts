import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TrackLinkInput {
  @Field()
  linkId: string;
  @Field()
  referrer: string;
  @Field()
  userAgent: string;
  @Field()
  ipAddress: string;
}
