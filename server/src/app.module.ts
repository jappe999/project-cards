import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './games/games.module';
import { SessionsModule } from './sessions/sessions.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GamesModule, SessionsModule, CardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
