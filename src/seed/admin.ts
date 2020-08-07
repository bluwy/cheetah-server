import { Admin, AdminPrivilege } from '../models/Admin'
import { PasswordService } from '../services/password'

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
  // Use service to hash so can be stub during tests.
  // This also imitates production code.
  const passwordService = new PasswordService()

  const insertAdmins = await Promise.all(
    admins.map(async admin => ({
      username: admin.username,
      privilege: admin.privilege,
      hash: await passwordService.hashPassword(admin.password)
    }))
  )

  await Admin.query().insert(insertAdmins)
}
