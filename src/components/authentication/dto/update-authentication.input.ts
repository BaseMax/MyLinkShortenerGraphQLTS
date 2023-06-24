import { CreateAuthenticationInput } from './create-authentication.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthenticationInput extends PartialType(CreateAuthenticationInput) {
  id: number;
}
