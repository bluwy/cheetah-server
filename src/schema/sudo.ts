import { UserInputError } from 'apollo-server-express'
import { arg, mutationField, stringArg } from 'nexus'
import { Admin } from '../models/Admin'
import { ifIs, AuthType } from '../utils/auth'
import { getEnvVar } from '../utils/common'

const RESET_PASSWORD_LINK = getEnvVar('RESET_PASSWORD_LINK')

export const sudoCreateAdmin = mutationField('sudoCreateAdmin', {
  type: 'Admin',
  args: {
    sudoPassword: stringArg({ required: true }),
    data: arg({
      type: 'AdminCreateInput',
      required: true
    })
  },
  authorize: ifIs(AuthType.Sudo),
  async resolve(_, { data }, { passwordService, sessionService }) {
    const hash = await passwordService.hashPassword(data.password)

    const admin = await Admin.query()
      .insert({
        username: data.username,
        privilege: data.privilege,
        hash
      })
      .returning('*')

    await sessionService.signup(admin.id)

    return admin
  }
})

export const sudoGenAdminResetPasswordLink = mutationField(
  'sudoGenAdminResetPasswordLink',
  {
    type: 'String',
    args: {
      sudoPassword: stringArg({ required: true }),
      username: stringArg({ required: true })
    },
    authorize: ifIs(AuthType.Sudo),
    async resolve(_, { username }, { passwordService }) {
      const admin = await Admin.query()
        .findOne('username', username)
        .select('id')

      if (admin != null) {
        const resetToken = await passwordService.generateResetToken(admin.id)

        return RESET_PASSWORD_LINK + resetToken
      }

      throw new UserInputError('Invalid username')
    }
  }
)
