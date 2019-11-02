import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Deck } from '../decks/deck.entity'

export type CardType = 'A' | 'Q'

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 1 })
  type!: CardType | string

  @Column()
  text!: string

  @Column()
  numAnswers!: number

  @Column({ nullable: true })
  deckId?: string

  @ManyToOne(() => Deck, deck => deck.cards)
  deck?: Deck
}
