import Model from './Model'

export interface IGame {
  id?: string
  name: string
  private: boolean
  creator?: {}
  session?: {}
}

export class Game extends Model implements IGame {
  name: string = ''
  private: boolean = false
  creator: {} = {}
  session: {} = {}
}

export class GameView extends Game {
  id: string = ''
}

export class GameJoin extends Model {
  name: string = ''
}
