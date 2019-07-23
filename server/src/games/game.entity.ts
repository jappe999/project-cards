import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 128 })
  name!: string

  @Column({ type: 'int', nullable: true })
  userLimit?: number

  @Column()
  private!: boolean
}
