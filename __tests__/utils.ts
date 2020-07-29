import { createTestClient } from 'apollo-server-testing'
import Knex from 'knex'
import nanoid from 'nanoid/non-secure'
import { Model } from 'objection'
import { server } from '@src/index'
import { knex } from '@src/objection'
import { getEnvVar } from '@src/utils/common'
import { seedDatabase } from './seed'

const DATABASE_TEST_URL = getEnvVar('DATABASE_TEST_URL')

const randomDbName = nanoid()

export const newTestClient = () => createTestClient(server)

// beforeAll
export async function initDatabase() {
  await createDatabase()
  Model.knex(
    Knex({
      client: 'pg',
      connection: {
        connectionString: DATABASE_TEST_URL.replace(/[^/]*$/, randomDbName)
      }
    })
  )
}

// beforeEach
export async function setupDatabase() {
  Model.knex().destroy()
  await dropDatabase()
  await createDatabase()
  Model.knex().initialize()
  await migrateDatabase()
  await seedDatabase()
}

// afterAll
export async function cleanupDatabase() {
  await Model.knex().destroy()
  await dropDatabase()
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
