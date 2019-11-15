import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import cards from './cards.json'

const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export default class DecksSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<any> {
    const decks = Object.keys(groupBy(cards, 'deck'))
      .map(name => ({ id: name.replace(/\s/g, '').toLowerCase(), name }))


    await connection
      .createQueryBuilder()
      .insert()
      .into('deck', ['id', 'name'])
      .values(decks)
      .execute()
  }
}
