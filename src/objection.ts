import Knex from 'knex'
import { Model } from 'objection'

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL

export const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL
  }
})

if (process.env.NODE_ENV === 'development' && process.env.LOG_QUERY) {
  knex.on('query', ({ sql, bindings }) => {
    console.log('[POSTGRES]')
    console.log('SQL:', sql)
    console.log('Bindings:', bindings)
    console.log()
  })
}

/*
  NOTE: When testing, Model.knex will assigned to a random knex instance
  connected to a random database. This above knex instance will instead
  be used to create/drop the runtime-generated random database.
*/
if (process.env.NODE_ENV !== 'test') {
  Model.knex(knex)
}
