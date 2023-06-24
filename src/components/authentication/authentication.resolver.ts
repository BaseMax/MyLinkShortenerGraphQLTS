import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationInput } from './dto/create-authentication.input';
import { UpdateAuthenticationInput } from './dto/update-authentication.input';

@Resolver('Authentication')
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation('createAuthentication')
  create(@Args('createAuthenticationInput') createAuthenticationInput: CreateAuthenticationInput) {
    return this.authenticationService.create(createAuthenticationInput);
  }

  @Query('authentication')
  findAll() {
    return this.authenticationService.findAll();
  }

  @Query('authentication')
  findOne(@Args('id') id: number) {
    return this.authenticationService.findOne(id);
  }

  @Mutation('updateAuthentication')
  update(@Args('updateAuthenticationInput') updateAuthenticationInput: UpdateAuthenticationInput) {
    return this.authenticationService.update(updateAuthenticationInput.id, updateAuthenticationInput);
  }

  @Mutation('removeAuthentication')
  remove(@Args('id') id: number) {
    return this.authenticationService.remove(id);
  }
}
