import { Controller, Get } from '@nestjs/common';

@Controller('games')
export class GamesController {
  @Get()
  games(): [] {
    return [];
  }
}
