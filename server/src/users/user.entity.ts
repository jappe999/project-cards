import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
} from 'typeorm'
import { Session } from '../sessions/session.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  username!: string

  @Column()
  password!: string

  @Column({ nullable: true })
  loginTime?: Date

  @ManyToMany(() => Session, session => session.players)
  @JoinColumn()
  sessions!: Session[]
}
