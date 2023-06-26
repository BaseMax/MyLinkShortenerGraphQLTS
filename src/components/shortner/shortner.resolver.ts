import { Resolver, Mutation, Args } from "@nestjs/graphql";
import User, { Iuser } from "../../decorator/user.decorator";
import { CreateShortnerInput } from "./dto/create-shortner.input";
import { UpdateShortnerInput } from "./dto/update-shortner.input";
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

  @Mutation("updateShortUrl")
  public async updateShortUrl(@Args("cs") cs: UpdateShortnerInput) {
    return await this.shortnerService.updateShortUrl(cs);
  }
}
