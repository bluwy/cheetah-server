import { createTestClient } from 'apollo-server-testing'
import Knex from 'knex'
import { nanoid } from 'nanoid/non-secure'
import { Model } from 'objection'
import { server } from '@src/index'
import { seedDatabase } from '@src/seed'
import { getEnvVar } from '@src/utils/common'

const DATABASE_URL = getEnvVar('DATABASE_URL')

const randomDbName = nanoid()
const masterKnex = Model.knex()

export const newTestClient = () => createTestClient(server)

// beforeAll
export async function initDatabase() {
  await createDatabase()
  Model.knex(
    Knex({
      client: 'pg',
      connection: DATABASE_URL.replace(/[^/]*$/, randomDbName)
    })
  )
}

// beforeEach
export async function setupDatabase() {
  await Model.knex().destroy()
  await dropDatabase()
  await createDatabase()
  Model.knex().initialize()
  await Model.knex().migrate.latest()
  await seedDatabase()
}

// afterAll
export async function cleanupDatabase() {
  await Model.knex().destroy()
  await dropDatabase()
  await masterKnex.destroy()
}

async function createDatabase() {
  await masterKnex.raw('CREATE DATABASE ??', randomDbName)
}

async function dropDatabase() {
  await masterKnex.raw('DROP DATABASE IF EXISTS ??', randomDbName)
}
