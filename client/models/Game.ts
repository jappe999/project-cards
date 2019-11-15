import Model from './Model'
import { DeckView } from './Deck'
import { SessionView } from './Session'

export interface IGame {
  id?: string
  name: string
  private: boolean
  creator?: {}
  session?: SessionView
  decks?: DeckView[]
}

export class Game extends Model implements IGame {
  name: string = ''
  private: boolean = false
  creator: {} = {}
  session: SessionView = <SessionView>{}
  decks: DeckView[] = []
}

export class GameView extends Game {
  id: string = ''
}

export class GameJoin extends Model {
  name: string = ''
}

export class GameCreate extends Model implements IGame {
  name: string = ''
  private: boolean = false
  decks: DeckView[] = []
}
