const user = process.env.DB_USER
const pass = process.env.DB_PASS
const host = process.env.DB_HOST
const port = process.env.DB_PORT
const name = process.env.DB_NAME

module.exports = {
  type: 'postgres',
  keepConnectionAlive: true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  url: `postgres://${user}:${pass}@${host}:${port}/${name}`,
  synchronize: true,
  seeds: ['server/database/seeders/database.seeder.ts'],
  factories: ['server/database/factories/**/*.factory.ts'],
}
