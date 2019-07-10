import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import cards from './cards.json'

export default class CardsSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('card', ['type', 'text', 'numAnswers', 'expansion'])
      .values(cards)
      .execute()
  }
}
