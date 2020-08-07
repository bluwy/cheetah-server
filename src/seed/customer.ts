import { Customer } from '../models/Customer'
import { Company } from '../models/Company'
import { Staff } from '../models/Staff'

export const customers = [
  {
    code: 'bco',
    name: 'bearing co.',
    active: true,
    addresses: ['international space station', 'moon'],
    email: 'bco@b.co',
    phoneNumber: '012-3445678',
    companyBelongIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1
  },
  {
    code: 'bga',
    name: 'baggage holdings',
    active: true,
    addresses: ['burj hotel'],
    email: 'bco@b.co',
    phoneNumber: null,
    companyBelongIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1
  },
  {
    code: 'unknown',
    name: 'void co.',
    active: true,
    addresses: [],
    email: null,
    phoneNumber: null,
    companyBelongIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1
  },
  {
    code: 'kao',
    name: 'wakao inc',
    active: false,
    addresses: ['sunset'],
    email: null,
    phoneNumber: null,
    companyBelongIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: null
  }
]

export async function seedCustomer() {
  const companies = await Company.query()
  const staffs = await Staff.query()

  const insertCustomers = customers.map(customer => {
    const {
      companyBelongIndex: cbi,
      staffPrimaryIndex: spi,
      staffSecondaryIndex: ssi,
      ...others
    } = customer

    return {
      ...others,
      companyBelongId: companies[cbi].id,
      staffPrimaryId: staffs[spi].id,
      staffSecondaryId: ssi ? staffs[ssi].id : undefined
    }
  })

  await Customer.query().insert(insertCustomers)
}
