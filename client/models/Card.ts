import Model from './Model'

export interface ICard {
  id?: string
  text: string
}

export class Card extends Model implements ICard {
  id?: string
  text!: string
}

export class CardView extends Card {
  id!: string
}
