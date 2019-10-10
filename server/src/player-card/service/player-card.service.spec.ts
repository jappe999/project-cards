import { Test, TestingModule } from '@nestjs/testing';
import { PlayerCardService } from './player-card.service';

describe('PlayerCardService', () => {
  let service: PlayerCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerCardService],
    }).compile();

    service = module.get<PlayerCardService>(PlayerCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
