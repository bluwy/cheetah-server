import Knex from 'knex'
import { Model } from 'objection'
import { seedDatabase } from '../src/seed'
import { getEnvVar } from '../src/utils/common'

const DATABASE_URL = getEnvVar('DATABASE_URL')

const databaseName = DATABASE_URL.match(/[^/]*$/)?.[0]

if (databaseName == null) {
  throw new Error(`Unable to find database name from "${DATABASE_URL}"`)
}

if (databaseName === 'postgres') {
  throw new Error(
    'Database name should not be "postgres". Connect to a different database.'
  )
}

// Connect to postgres database to drop/create the target database
const masterKnex = Knex({
  client: 'pg',
  connection: DATABASE_URL.replace(/[^/]*$/, 'postgres')
})
;(async () => {
  console.log(`Setup database: "${databaseName}".`)

  console.log('Dropping database...')
  await masterKnex.raw('DROP DATABASE IF EXISTS ??', databaseName)

  console.log('Creating database...')
  await masterKnex.raw('CREATE DATABASE ??', databaseName)

  const targetKnex = Knex({
    client: 'pg',
    connection: {
      connectionString: DATABASE_URL
    }
  })

  console.log('Migrating database...')
  await targetKnex.migrate.latest()

  // seedDatabase uses Objection, so initialize Model.knex first
  Model.knex(targetKnex)
  console.log('Seeding database...')
  await seedDatabase()

  // Clean-up connection
  await targetKnex.destroy()
  await masterKnex.destroy()
})()
