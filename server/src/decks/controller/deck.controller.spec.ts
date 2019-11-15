import { Test, TestingModule } from '@nestjs/testing';
import { DecksController } from './deck.controller';

describe('Decks Controller', () => {
  let controller: DecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecksController],
    }).compile();

    controller = module.get<DecksController>(DecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
