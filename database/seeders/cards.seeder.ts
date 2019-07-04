import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Card } from '../../src/cards/card.entity';
import * as cards from './cards.json';

export default class CardsSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values(cards)
      .execute();
  }
}
