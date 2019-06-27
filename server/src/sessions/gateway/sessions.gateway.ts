import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { Game } from '../../games/game.entity';
import { SessionsService } from '../service/sessions.service';
import { Session } from '../session.entity';

@WebSocketGateway()
export class SessionsGateway implements OnGatewayDisconnect {
  constructor(private sessionsService: SessionsService) {}

  handleDisconnect(socket: Socket) {}

  @SubscribeMessage('session-join')
  joinSession(client: Socket, game: Game): Observable<WsResponse<Session>> {
    return this.sessionsService.joinGame(client, game);
  }

  @SubscribeMessage('session-play-card')
  playCard(
    client: Socket,
    payload: { session: Session; card: string },
  ): Observable<WsResponse<string>> {
    return this.sessionsService.playCard(client, payload);
  }
}
