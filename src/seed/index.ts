import { seedAdmin } from './admin'
import { seedStaff } from './staff'
import { seedCompany } from './company'
import { seedCustomer } from './customer'

export async function seedDatabase() {
  await seedCompany()
  await seedAdmin()
  await seedStaff()
  await seedCustomer()
}
