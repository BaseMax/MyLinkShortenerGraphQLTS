import { Resolver, Mutation, Args } from "@nestjs/graphql";
import User, { Iuser } from "../../decorator/user.decorator";
import { CreateShortnerInput } from "./dto/create-shortner.input";
import { ShortnerService } from "./shortner.service";

@Resolver("Shortner")
export class ShortnerResolver {
  constructor(private readonly shortnerService: ShortnerService) {}

  @Mutation("createShortUrl")
  public async createShortUrl(
    @Args("cs") cs: CreateShortnerInput,
    @User() { id }: Iuser,
  ) {
    cs["userId"] = id;
    return await this.shortnerService.createShortUrl(cs);
  }
}
