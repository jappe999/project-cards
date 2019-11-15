import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import CardsSeeder from './cards.seeder'
import DecksSeeder from './decks.seeder'

export default class DatabaseSeeder implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<any> {
        await new DecksSeeder().run(factory, connection)
        await new CardsSeeder().run(factory, connection)
    }
}