import { AuthenticationError, UserInputError } from 'apollo-server'
import { arg, enumType, extendType, inputObjectType, objectType, stringArg } from 'nexus'
import { AdminForgotPasswordPayload, AdminPayload, AdminPrivilege as EnumAdminPrivilege, UserRole } from '../../services/auth'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.admin()
    t.crud.admins({
      filtering: true,
      ordering: true,
      pagination: true
    })

    t.field('verifyAdminToken', {
      type: 'AdminVerifyTokenResponse',
      nullable: true,
      args: {
        token: stringArg({ required: true })
      },
      async resolve (_, { token }, { auth }) {
        const decoded = await auth.verifyJwt(token).catch(() => ({}))

        if (typeof decoded !== 'string' && auth.isAdminPayload(decoded)) {
          return {
            adminId: decoded.id,
            adminPrivilege: decoded.privilege
          }
        } else {
          throw new AuthenticationError('Invalid token')
        }
      }
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.field('createAdmin', {
      type: 'Admin',
      args: {
        data: arg({
          type: 'AdminCreateInput',
          required: true
        })
      },
      async resolve (_, { data }, { auth, photon }) {
        const hash = await auth.hashPassword(data.password)

        return photon.admins.create({
          data: {
            username: data.username,
            privilege: data.privilege,
            hash
          }
        })
      }
    })

    t.crud.updateOneAdmin({ alias: 'updateAdmin' })
    t.crud.deleteOneAdmin({ alias: 'deleteAdmin' })

    t.field('forgotAdminPassword', {
      type: 'Boolean',
      args: {
        username: stringArg({ required: true })
      },
      async resolve (_, { username }, { auth, mail, photon }) {
        const admin = await photon.admins.findOne({ select: { id: true }, where: { username } })

        if (admin != null) {
          const payload: AdminForgotPasswordPayload = {
            id: admin.id
          }

          const token = await auth.signJwt(payload, { expiresIn: auth.adminForgotDuration })

          await mail.mg.messages().send({
            from: 'Xecom Job <no-reply@example.com>',
            to: `${username} <${mail.companyEmail}>`,
            subject: `Xecom Job Admin: Reset password for ${username}`,
            template: 'xja-forgot',
            'v:username': username,
            'v:verifyLink': `${process.env.CLIENT_ADMIN_DOMAIN}/reset?token=${token}`
          })

          return true
        } else {
          throw new UserInputError('Invalid username', { invalidArgs: ['username'] })
        }
      }
    })

    t.field('resetAdminPassword', {
      type: 'Boolean',
      args: {
        token: stringArg({ required: true }),
        newPassword: stringArg({ required: true })
      },
      async resolve (_, { token, newPassword }, { auth, photon }) {
        const decoded = await auth.verifyJwt(token).catch(() => ({})) as object

        if (auth.isForgotAdminPayload(decoded)) {
          const hash = await auth.hashPassword(newPassword)
          await photon.admins.update({ data: { hash }, where: { id: decoded.id } })
          return true
        } else {
          throw new UserInputError('Invalid token', { invalidArgs: ['token'] })
        }
      }
    })

    t.field('updateAdminPassword', {
      type: 'Boolean',
      args: {
        oldPassword: stringArg({ required: true }),
        newPassword: stringArg({ required: true }),
        where: arg({ type: 'AdminWhereUniqueInput', required: true })
      },
      async resolve (_, { oldPassword, newPassword, where }, { auth, photon }) {
        const admin = await photon.admins.findOne({ select: { hash: true }, where })

        if (admin != null) {
          if (await auth.verifyPassword(admin.hash, oldPassword)) {
            const hash = await auth.hashPassword(newPassword)

            await photon.admins.update({ data: { hash }, where })

            return true
          } else {
            throw new UserInputError('Invalid password', { invalidArgs: ['oldPassword'] })
          }
        } else {
          throw new UserInputError('Invalid where', { invalidArgs: ['where'] })
        }
      }
    })

    t.field('loginAdmin', {
      type: 'AdminLoginResponse',
      args: {
        username: stringArg({ required: true }),
        password: stringArg({ required: true })
      },
      async resolve (_, { username, password }, { auth, photon }) {
        const admin = await photon.admins.findOne({
          select: { id: true, privilege: true, hash: true },
          where: { username }
        })

        if (admin != null && await auth.verifyPassword(admin.hash, password)) {
          const payload: AdminPayload = {
            role: UserRole.Admin,
            id: admin.id,
            privilege: admin.privilege as EnumAdminPrivilege
          }

          const token = await auth.signJwt(payload, { expiresIn: auth.adminLoginDuration })

          return { token, adminId: admin.id, adminPrivilege: admin.privilege }
        } else {
          throw new AuthenticationError('Invalid username or password')
        }
      }
    })
  }
})

export const Admin = objectType({
  name: 'Admin',
  definition (t) {
    t.model.id()
    t.model.username()
    t.model.privilege()
  }
})

export const AdminLoginResponse = objectType({
  name: 'AdminLoginResponse',
  definition (t) {
    t.string('token')
    t.string('adminId')
    t.field('adminPrivilege', { type: 'AdminPrivilege' })
  }
})

export const AdminVerifyTokenResponse = objectType({
  name: 'AdminVerifyTokenResponse',
  definition (t) {
    t.string('adminId')
    t.field('adminPrivilege', { type: 'AdminPrivilege' })
  }
})

export const AdminCreateInput = inputObjectType({
  name: 'AdminCreateInput',
  definition (t) {
    t.string('username', { required: true })
    t.string('password', { required: true })
    t.field('privilege', { type: 'AdminPrivilege', required: true })
  }
})

export const AdminUpdateInput = inputObjectType({
  name: 'AdminUpdateInput',
  definition (t) {
    t.string('username')
  }
})

export const AdminPrivilege = enumType({
  name: 'AdminPrivilege',
  members: Object.values(EnumAdminPrivilege)
})
