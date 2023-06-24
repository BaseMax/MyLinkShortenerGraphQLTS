import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ResetPasswordInput {
  @Field()
  code: number;
  @Field()
  password: string;
}
