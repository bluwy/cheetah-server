import { Company } from '@src/models/Company'

export const companies = [
  {
    name: 'amazon',
    alias: 'az'
  },
  {
    name: 'google',
    alias: 'g'
  }
]

export async function seedCompany() {
  await Company.query().insert(companies)
}
