import { AuthenticationError, UserInputError } from 'apollo-server'
import { arg, extendType, inputObjectType, objectType, stringArg } from 'nexus'
import { StaffPayload, UserRole } from '../../services/auth'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.staff()
    t.crud.staffs({
      filtering: true,
      ordering: true,
      pagination: true
    })

    t.field('verifyStaffToken', {
      type: 'StaffVerifyTokenResponse',
      nullable: true,
      args: {
        token: stringArg({ required: true })
      },
      async resolve (_, { token }, { auth }) {
        const decoded = await auth.verifyJwt(token).catch(() => ({}))

        if (typeof decoded !== 'string' && auth.isStaffPayload(decoded)) {
          return {
            staffId: decoded.id
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
    t.field('createStaff', {
      type: 'Staff',
      args: {
        data: arg({
          type: 'StaffCreateInput',
          required: true
        })
      },
      async resolve (_, { data }, { auth, photon }) {
        const hash = await auth.hashPassword(data.password)

        return photon.staff.create({
          data: {
            username: data.username,
            fullName: data.fullName,
            hash
          }
        })
      }
    })

    t.crud.updateOneStaff({ alias: 'updateStaff' })
    t.crud.deleteOneStaff({ alias: 'deleteStaff' })

    // Staff alert admin of forgot password
    t.field('forgotStaffPassword', {
      type: 'Boolean',
      args: {
        where: arg({ type: 'StaffWhereUniqueInput', required: true })
      },
      async resolve (_, { where }, { photon }) {
        const staff = await photon.staff.update({ data: { passwordForgotten: true }, where })

        if (staff != null) {
          return true
        } else {
          throw new UserInputError('Invalid where', { invalidArgs: ['where'] })
        }
      }
    })

    // Admin reset password
    t.field('resetStaffPassword', {
      type: 'Boolean',
      args: {
        newPassword: stringArg({ required: true }),
        where: arg({ type: 'StaffWhereUniqueInput', required: true })
      },
      async resolve (_, { newPassword, where }, { auth, photon }) {
        const hash = await auth.hashPassword(newPassword)

        const staff = await photon.staff.update({ data: { hash }, where })

        if (staff != null) {
          return true
        } else {
          throw new UserInputError('Invalid where', { invalidArgs: ['where'] })
        }
      }
    })

    t.field('loginStaff', {
      type: 'StaffLoginResponse',
      args: {
        username: stringArg({ required: true }),
        password: stringArg({ required: true })
      },
      async resolve (_, { username, password }, { auth, photon }) {
        const staff = await photon.staff.findOne({
          select: { id: true, hash: true },
          where: { username }
        })

        if (staff != null && await auth.verifyPassword(staff.hash, password)) {
          const payload: StaffPayload = {
            role: UserRole.Staff,
            id: staff.id
          }

          const token = await auth.signJwt(payload, { expiresIn: auth.staffLoginDuration })

          return { token, staffId: staff.id }
        } else {
          throw new AuthenticationError('Invalid username or password')
        }
      }
    })
  }
})

export const Staff = objectType({
  name: 'Staff',
  definition (t) {
    t.model.id()
    t.model.username()
    t.model.fullName()
    t.model.passwordForgotten()
  }
})

export const StaffLoginResponse = objectType({
  name: 'StaffLoginResponse',
  definition (t) {
    t.string('token')
    t.string('staffId')
  }
})

export const StaffVerifyTokenResponse = objectType({
  name: 'StaffVerifyTokenResponse',
  definition (t) {
    t.string('staffId')
  }
})

export const StaffCreateInput = inputObjectType({
  name: 'StaffCreateInput',
  definition (t) {
    t.string('username', { required: true })
    t.string('fullName', { required: true })
    t.string('password', { required: true })
  }
})

export const StaffUpdateInput = inputObjectType({
  name: 'StaffUpdateInput',
  definition (t) {
    t.string('username')
    t.string('fullName')
  }
})
