import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsUrl } from "class-validator";

@InputType()
export class CreateShortnerInput {
  @Field()
  @IsString()
  alias: string;

  @Field()
  @IsUrl()
  destinationUrl: string;
  @Field()
  @IsUrl()
  shortUrl?: string;

  @Field()
  expirationDate: Date | null;

  userId?: string;
}
