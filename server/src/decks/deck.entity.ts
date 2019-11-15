import { Entity, Column, OneToMany, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm'
import { Card } from '../cards/card.entity'
import { Game } from '../games/game.entity'

@Entity()
export class Deck {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @OneToMany(() => Card, card => card.deck)
  cards!: Card[]

  @ManyToMany(() => Game, game => game.decks)
  @JoinTable()
  games!: Game[]
}
