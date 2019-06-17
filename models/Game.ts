import Model from './Model'

export interface IGame {
  id?: string
  name: string
  private: boolean
}

export class Game extends Model implements IGame {
  name: string = ''
  private: boolean = false
}

export class GameView extends Game {
  id: string = ''
}

export class GameJoin extends Model {
  name: string = ''
}
