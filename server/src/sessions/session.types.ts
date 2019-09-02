import { User } from '../users/user.entity'
import { Session } from './session.entity'
import { CardViewDto } from '../cards/card.dto'

export class SessionData {
  /** @var user - The player. */
  user: User

  /** @var - The current session. */
  session: Session

  /** @var - The cards selected by the player for this round. */
  cards: CardViewDto[]

  /** @var - The current round. */
  round: number
}
