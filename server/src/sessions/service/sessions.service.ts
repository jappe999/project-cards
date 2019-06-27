import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../session.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { GameJoinDto } from 'src/games/game.dto';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WsResponse } from '@nestjs/websockets';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Let a user join a particular game.
   *
   * @param client - The socket.IO client
   * @param game - The game to join
   */
  joinGame(client: Socket, game: GameJoinDto): Observable<WsResponse<Session>> {
    // Construct room name.
    const room = `${game.id}-${game.name.replace(' ', '-')}`;

    // Join socket room.
    client.join(room);

    // Save session details for later usage.
    const session = this.sessionRepository.save({ room, game });

    return from(session).pipe(
      map(item => ({ event: 'session-join', data: item })),
    );
  }

  playCard(
    client: Socket,
    { session, card }: { session: Session; card: string },
  ): Observable<WsResponse<string>> {
    client.broadcast
      .to(client.rooms[session.room])
      .emit('session-play-card', card);

    return from([card]).pipe(
      map(item => ({ event: 'session-play-card', data: item })),
    );
  }
}
