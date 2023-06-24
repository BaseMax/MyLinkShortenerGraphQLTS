import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShortnerService } from './shortner.service';
import { CreateShortnerInput } from './dto/create-shortner.input';
import { UpdateShortnerInput } from './dto/update-shortner.input';

@Resolver('Shortner')
export class ShortnerResolver {
  constructor(private readonly shortnerService: ShortnerService) {}

  @Mutation('createShortner')
  create(@Args('createShortnerInput') createShortnerInput: CreateShortnerInput) {
    return this.shortnerService.create(createShortnerInput);
  }

  @Query('shortner')
  findAll() {
    return this.shortnerService.findAll();
  }

  @Query('shortner')
  findOne(@Args('id') id: number) {
    return this.shortnerService.findOne(id);
  }

  @Mutation('updateShortner')
  update(@Args('updateShortnerInput') updateShortnerInput: UpdateShortnerInput) {
    return this.shortnerService.update(updateShortnerInput.id, updateShortnerInput);
  }

  @Mutation('removeShortner')
  remove(@Args('id') id: number) {
    return this.shortnerService.remove(id);
  }
}
