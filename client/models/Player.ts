import Model from './Model'

export interface IPlayer {
  id?: string
  username: string
  password?: string
}

export class PlayerSignIn extends Model implements IPlayer {
  username!: string
  password!: string
}

export class PlayerView extends Model implements IPlayer {
  id!: string
  username!: string
}
