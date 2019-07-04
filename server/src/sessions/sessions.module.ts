import { Module } from '@nestjs/common';
import { SessionsGateway } from './gateway/sessions.gateway';
import { SessionsService } from './service/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), CardsModule],
  providers: [SessionsService, SessionsGateway],
})
export class SessionsModule { }
