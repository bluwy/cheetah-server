import Knex from 'knex'
import { Model } from 'objection'

export const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL
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
