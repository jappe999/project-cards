module.exports = {
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'production'
      ? 'postgres://zjevarcywtpjoi:6bbf1f577abb7ade0df29c71c4b2d57c7b207ffb695b205c949241540d79af76@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/ddnmseo8fmepc1'
      : 'postgres://root:root@psql.localhost:5433/projectcards',
  synchronize: true,
  seeds: ['server/database/seeders/**/*.seeder.ts'],
  factories: ['server/database/factories/**/*.factory.ts'],
}
