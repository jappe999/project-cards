import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GamesModule } from './games/games.module'
import { SessionsModule } from './sessions/sessions.module'
import { CardsModule } from './cards/cards.module'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import config from '../../ormconfig.json'
import { getMetadataArgsStorage } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...config as MysqlConnectionOptions,
    entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
  }), GamesModule, SessionsModule, CardsModule],
})
export class AppModule { }
