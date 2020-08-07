import { Admin, AdminPrivilege } from '../models/Admin'

export const admins = [
  {
    username: 'bob',
    privilege: AdminPrivilege.Basic,
    password: 'bobrocks'
  },
  {
    username: 'stacy',
    privilege: AdminPrivilege.Full,
    password: 'stacy123'
  }
]

export async function seedAdmin() {
  // Hash is same as password in tests
  const insertAdmins = await Promise.all(
    admins.map(async admin => ({
      username: admin.username,
      privilege: admin.privilege,
      hash: admin.password
    }))
  )

  await Admin.query().insert(insertAdmins)
}
