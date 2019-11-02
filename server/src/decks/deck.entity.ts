import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm'
import { Card } from '../cards/card.entity'

@Entity()
export class Deck {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @OneToMany(() => Card, card => card.deck)
  cards!: Card[]
}
