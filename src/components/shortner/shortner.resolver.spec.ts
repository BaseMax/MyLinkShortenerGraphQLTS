import { Test, TestingModule } from '@nestjs/testing';
import { ShortnerResolver } from './shortner.resolver';
import { ShortnerService } from './shortner.service';

describe('ShortnerResolver', () => {
  let resolver: ShortnerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortnerResolver, ShortnerService],
    }).compile();

    resolver = module.get<ShortnerResolver>(ShortnerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
