import { Test, TestingModule } from '@nestjs/testing';
import { PlayerSessionService } from './player-session.service';

describe('PlayerSessionService', () => {
  let service: PlayerSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerSessionService],
    }).compile();

    service = module.get<PlayerSessionService>(PlayerSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
