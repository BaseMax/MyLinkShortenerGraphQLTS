import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UpdateUserInput } from "./dto/update-user.input";
import User, { Iuser } from "../../decorator/user.decorator";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation("updateProfile")
  public async updateProfile(
    @Args("user") user: UpdateUserInput,
    @User() { id }: Iuser,
  ) {
    return await this.userService.updateProfile(id, user);
  }

  @Query("user")
  public async user(@User() { id }: Iuser) {
    return await this.userService.getUser(id);
  }
}
