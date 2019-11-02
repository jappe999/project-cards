import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GamesModule } from './games/games.module'
import { SessionsModule } from './sessions/sessions.module'
import { CardsModule } from './cards/cards.module'
import config from '../../ormconfig'
import { getMetadataArgsStorage } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PlayerSessionModule } from './player-session/player-session.module'
import { DecksModule } from './decks/decks'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(config as PostgresConnectionOptions),
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
    }),
    GamesModule,
    SessionsModule,
    CardsModule,
    DecksModule,
    UsersModule,
    AuthModule,
    PlayerSessionModule,
  ],
})
export class AppModule { }
