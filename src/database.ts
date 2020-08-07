import Knex from 'knex'
import nanoid from 'nanoid/non-secure'
import { Model } from 'objection'
import { seedDatabase } from './seed'
import { getEnvVar, log } from './utils/common'

const randomDbName = nanoid()

const DATABASE_URL = getEnvVar('DATABASE_URL')
const SEED_MODE =
  process.env.NODE_ENV === 'test' ||
  (process.env.NODE_ENV === 'development' && process.env.SEED_MODE)
const LOG_QUERY =
  process.env.NODE_ENV === 'development' && process.env.LOG_QUERY

// In seed mode, this knex instance will be used to instrument database create/drop
const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL
  }
})

// When testing, setupDatabase will be manually called in beforeAll hook to make
// sure it's properly setup before executing the tests.
if (process.env.NODE_ENV !== 'test') {
  setupDatabase()
}

export async function setupDatabase() {
  log('Setup database...')

  if (SEED_MODE) {
    await createDatabase()
    Model.knex(
      Knex({
        client: 'pg',
        connection: {
          connectionString: DATABASE_URL.replace(/[^/]*$/, randomDbName)
        }
      })
    )
    await migrateDatabase()
    await seedDatabase()
  } else {
    Model.knex(knex)
  }

  if (LOG_QUERY) {
    listenDatabaseQuery()
  }

  log('Database setup.')
}

/**
 * Recreate a freshly seeded database. mmm... Make sure there's no queries
 * running on the database before calling this function.
 */
export async function reseedDatabase() {
  log('Re-seeding database...')
  await Model.knex().destroy()
  await dropDatabase()
  await createDatabase()
  Model.knex().initialize()
  await migrateDatabase()
  await seedDatabase()
  log('Database re-seeded.')
}

// afterAll
export async function cleanupDatabase() {
  log('Cleaning up database...')
  await Model.knex().destroy()
  await dropDatabase()
  log('Database cleansed.')
}

/** Called on app exit. Used in test's afterAll hook. */
export async function cleanupAll() {
  await cleanupDatabase()
  await knex.destroy()
}

async function migrateDatabase() {
  await Model.knex().migrate.latest({
    directory: 'migrations',
    extension: 'ts'
  })
}

async function createDatabase() {
  await knex.raw('CREATE DATABASE ??', randomDbName)
}

async function dropDatabase() {
  await knex.raw('DROP DATABASE IF EXISTS ??', randomDbName)
}

function listenDatabaseQuery() {
  Model.knex().on('query', ({ sql, bindings }) => {
    console.log('[POSTGRES]')
    console.log('Query   :', sql)
    console.log('Bindings:', bindings)
    console.log()
  })
}
