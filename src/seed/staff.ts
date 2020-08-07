import { Staff } from '../models/Staff'

export const staffs = [
  {
    username: 'alice',
    fullName: 'Alice Axel',
    deviceId: 'ABD-876-IOW',
    active: true
  },
  {
    username: 'tyler',
    fullName: 'Tyler Lowell',
    deviceId: 'POI-810-HHA',
    active: false
  }
]

export async function seedStaff() {
  await Staff.query().insert(staffs)
}
