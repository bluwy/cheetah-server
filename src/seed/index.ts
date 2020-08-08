import { seedAdmin } from './admin'
import { seedCompany } from './company'
import { seedCustomer } from './customer'
import { seedJob } from './job'
import { seedStaff } from './staff'

/**
 * Seeds the database. Make sure Objection's knex is initialized and the
 * database is migrated before seeding.
 */
export async function seedDatabase() {
  // NOTE: Call order matters due to relations. Luckily there's no circular
  // references so no weird workarounds happening.
  await seedAdmin()
  await seedStaff()
  await seedCompany()
  await seedCustomer()
  await seedJob()
}
