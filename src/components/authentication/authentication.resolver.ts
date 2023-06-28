import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthenticationService } from "./authentication.service";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { ResetPasswordInput } from "./dto/resetPass.input";

@Resolver("Authentication")
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation("register")
  public async register(@Args("ri") ri: RegisterInput) {
    return await this.authenticationService.register(ri);
  }

  @Mutation("login")
  public async login(@Args("ri") ri: LoginInput) {
    return await this.authenticationService.login(ri);
  }

  @Mutation("forgotPassword")
  public async forgotPassword(@Args("email") email: string) {
    return await this.authenticationService.forgotPassword(email);
  }

  @Mutation("resetPassword")
  public async resetPassword(@Args("rp") rp: ResetPasswordInput) {
    return await this.authenticationService.resetPassword(rp);
  }
}
