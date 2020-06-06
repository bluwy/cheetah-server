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

if (process.env.LOG_QUERY) {
  knex.on('query', ({ sql, bindings }) => {
    console.log('[POSTGRES]')
    console.log('SQL:', sql)
    console.log('Bindings:', bindings)
    console.log()
  })
}

Model.knex(knex)
