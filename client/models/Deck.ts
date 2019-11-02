import Model from './Model'

export interface IDeck {
  id?: string
  name: string
  shortname: string
}

export class Deck extends Model implements IDeck {
  id?: string
  name!: string
  shortname!: string
}

export class DeckView extends Deck {
  id!: string
}
