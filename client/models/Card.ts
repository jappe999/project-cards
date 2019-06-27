import Model from './Model'

export interface ICard {
  id?: string
  name: string
  private: boolean
}

export class Card extends Model implements ICard {
  id?: string
  name!: string
  private!: boolean
}

export class CardView extends Card {
  id!: string
}
