import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionsGateway } from './gateway/sessions.gateway'
import { SessionsService } from './service/sessions.service'
import { Session } from './session.entity'
import { CardsModule } from '../cards/cards.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Session]), CardsModule, AuthModule],
  providers: [SessionsService, SessionsGateway],
})
export class SessionsModule {}
