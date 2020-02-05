require('dotenv').config()
require('ts-node/register')

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    stub: 'migrations/migration.stub'
  }
}
