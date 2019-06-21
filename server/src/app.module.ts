import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './games/games.module';
import { SessionsGateway } from './sessions/sessions.gateway';

@Module({
  imports: [TypeOrmModule.forRoot(), GamesModule],
  controllers: [],
  providers: [SessionsGateway],
})
export class AppModule {}
