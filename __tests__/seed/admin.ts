import { hash } from 'argon2'
import { Admin, AdminPrivilege } from '@src/models/Admin'

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
  // Convert admins passwords to hashes
  const insertAdmins = await Promise.all(
    admins.map(async admin => {
      const { password, ...others } = admin

      return {
        ...others,
        hash: await hash(password)
      }
    })
  )

  await Admin.query().insert(insertAdmins)
}
