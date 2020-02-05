import Knex from 'knex'
import { Model } from 'objection'

export const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL
  }
})

Model.knex(knex)
