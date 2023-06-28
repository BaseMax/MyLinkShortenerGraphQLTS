import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateShortnerInput {
  @Field()
  @IsString()
  alias: string;

  @Field()
  destinationUrl: string;

  @Field()
  shortUrl?: string;

  @Field()
  expirationDate: Date | null;

  userId?: string;
}
