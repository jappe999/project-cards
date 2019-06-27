import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './games/games.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GamesModule, SessionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
