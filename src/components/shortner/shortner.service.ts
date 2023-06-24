import { Injectable } from '@nestjs/common';
import { CreateShortnerInput } from './dto/create-shortner.input';
import { UpdateShortnerInput } from './dto/update-shortner.input';

@Injectable()
export class ShortnerService {
  create(createShortnerInput: CreateShortnerInput) {
    return 'This action adds a new shortner';
  }

  findAll() {
    return `This action returns all shortner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shortner`;
  }

  update(id: number, updateShortnerInput: UpdateShortnerInput) {
    return `This action updates a #${id} shortner`;
  }

  remove(id: number) {
    return `This action removes a #${id} shortner`;
  }
}
