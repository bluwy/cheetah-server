import Knex from 'knex'
import { Model } from 'objection'
import { getEnvVar } from './utils/common'

const DATABASE_URL = getEnvVar('DATABASE_URL')

const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL
  }
})

if (process.env.NODE_ENV === 'development' && process.env.LOG_QUERY) {
  knex.on('query', ({ sql, bindings }) => {
    console.log('[POSTGRES]')
    console.log('Query   :', sql)
    console.log('Bindings:', bindings)
    console.log()
  })
}

Model.knex(knex)
