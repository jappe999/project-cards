import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import cards from './cards.json'

export default class CardsSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<any> {
    const transformedCards = cards.map(card => ({
      type: card.type,
      text: card.text,
      numAnswers: card.numAnswers,
      deckId: card.deck.replace(/\s/g, '').toLowerCase()
    }))

    await connection
      .createQueryBuilder()
      .insert()
      .into('card', ['type', 'text', 'numAnswers', 'deckId'])
      .values(transformedCards)
      .execute()
  }
}
