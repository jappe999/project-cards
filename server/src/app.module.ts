import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GamesModule } from './games/games.module'
import { SessionsModule } from './sessions/sessions.module'
import { CardsModule } from './cards/cards.module'
import config from '../../ormconfig'
import { getMetadataArgsStorage } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(config as PostgresConnectionOptions),
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
    }),
    GamesModule,
    SessionsModule,
    CardsModule,
  ],
})
export class AppModule {}
