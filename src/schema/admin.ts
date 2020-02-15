import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-express'
import {
  arg,
  enumType,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField,
  stringArg
} from 'nexus'
import { Admin, adminPrivileges } from '../models/Admin'
import { enumFilter, filterInputNonNullable } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const admin = queryField('admin', {
  type: 'Admin',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    return Admin.query().findById(id)
  }
})

// Use session id
export const thisAdmin = queryField('thisAdmin', {
  type: 'Admin',
  async resolve(_, __, { sessionService }) {
    const sessionData = sessionService.getSession()?.data

    if (sessionData == null) {
      throw new AuthenticationError('Not authenticated')
    }

    if (
      sessionData.type === 'ADMIN_BASIC' ||
      sessionData.type === 'ADMIN_FULL'
    ) {
      return Admin.query().findById(sessionData.userId)
    }

    throw new ForbiddenError('Not an admin')
  }
})

export const admins = queryField('admins', {
  type: 'Admin',
  list: true,
  args: {
    skip: intArg(),
    first: intArg(),
    where: arg({ type: 'AdminWhereInput' }),
    orderBy: arg({ type: 'AdminOrderByInput' })
  },
  async resolve(_, { skip, first, where, orderBy }) {
    skip = skip ?? 0
    first = first != null ? Math.min(first, 50) : 10

    return Admin.query()
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where)
      .modify(resolveOrderByInput, orderBy)
  }
})

export const createAdmin = mutationField('createAdmin', {
  type: 'Admin',
  args: {
    data: arg({
      type: 'AdminCreateInput',
      required: true
    })
  },
  async resolve(_, { data }, { passwordService, sessionService }) {
    const { password, ...rest } = data
    const hash = await passwordService.hashPassword(password)
    const newData = { ...rest, hash }

    const admin = await Admin.query()
      .insert(newData)
      .returning('*')

    await sessionService.signup(admin.id)

    return admin
  }
})

export const updateAdmin = mutationField('updateAdmin', {
  type: 'Admin',
  args: {
    data: arg({
      type: 'AdminUpdateInput',
      required: true
    })
  },
  async resolve(_, { data }) {
    data = filterInputNonNullable(data, ['username'])

    return Admin.query()
      .update(data as any)
      .returning('*')
      .first()
  }
})

export const deleteAdmin = mutationField('deleteAdmin', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    const deleteCount = await Admin.query().deleteById(id)

    if (deleteCount <= 0) {
      throw new UserInputError('Admin not found with id: ' + id)
    }

    return true
  }
})

export const sendAdminResetPasswordEmail = mutationField(
  'sendAdminResetPasswordEmail',
  {
    type: 'Boolean',
    args: {
      username: stringArg({ required: true })
    },
    async resolve(_, { username }, { mailService }) {
      const admin = await Admin.query().findOne('username', username)

      if (admin != null) {
        await mailService.sendResetPasswordEmail(username, '')

        return true
      }

      throw new UserInputError('Invalid username')
    }
  }
)

export const resetAdminPassword = mutationField('resetAdminPassword', {
  type: 'Boolean',
  args: {
    resetToken: stringArg({ required: true }),
    newPassword: stringArg({ required: true })
  },
  async resolve(
    _,
    { resetToken, newPassword },
    { passwordService, sessionService }
  ) {
    const userId = await passwordService.checkResetToken(resetToken)

    if (userId != null) {
      const hash = await passwordService.hashPassword(newPassword)

      await Admin.query().update({ hash })

      await sessionService.logoutAll(userId)

      return true
    }

    throw new UserInputError('Invalid reset token')
  }
})

// Use session id
export const updateThisAdminPassword = mutationField(
  'updateThisAdminPassword',
  {
    type: 'Boolean',
    args: {
      oldPassword: stringArg({ required: true }),
      newPassword: stringArg({ required: true })
    },
    async resolve(
      _,
      { oldPassword, newPassword },
      { passwordService, sessionService }
    ) {
      const sessionData = sessionService.getSession()?.data

      if (sessionData == null) {
        throw new AuthenticationError('Not authenticated')
      }

      const admin = await Admin.query()
        .findById(sessionData.userId)
        .select('hash')

      if (admin == null) {
        throw new Error('Admin not found with id: ' + sessionData.userId)
      }

      if (await passwordService.verifyPassword(admin.hash, oldPassword)) {
        const newHash = await passwordService.hashPassword(newPassword)

        await Admin.query().update({ hash: newHash })

        return true
      }

      throw new AuthenticationError('Invalid password')
    }
  }
)

export const loginAdmin = mutationField('loginAdmin', {
  type: 'Boolean',
  args: {
    username: stringArg({ required: true }),
    password: stringArg({ required: true })
  },
  async resolve(
    _,
    { username, password },
    { passwordService, sessionService }
  ) {
    const admin = await Admin.query()
      .where('username', username)
      .first()

    if (
      admin != null &&
      (await passwordService.verifyPassword(admin.hash, password))
    ) {
      await sessionService.login({
        userId: admin.id,
        type: admin.privilege === 'FULL' ? 'ADMIN_FULL' : 'ADMIN_BASIC'
      })

      return true
    }

    throw new AuthenticationError('Invalid username or password')
  }
})

export const logoutAdmin = mutationField('logoutAdmin', {
  type: 'Boolean',
  async resolve(_, __, { sessionService }) {
    await sessionService.logout()

    return true
  }
})

export const AdminObject = objectType({
  name: 'Admin',
  definition(t) {
    t.id('id')
    t.string('username')
    t.field('privilege', { type: 'AdminPrivilege' })
  }
})

export const AdminCreateInput = inputObjectType({
  name: 'AdminCreateInput',
  definition(t) {
    t.string('username', { required: true })
    t.string('password', { required: true })
    t.field('privilege', { type: 'AdminPrivilege', required: true })
  }
})

export const AdminUpdateInput = inputObjectType({
  name: 'AdminUpdateInput',
  definition(t) {
    t.string('username')
  }
})

export const AdminWhereInput = inputObjectType({
  name: 'AdminWhereInput',
  definition(t) {
    t.list.field('AND', { type: 'AdminWhereInput' })
    t.list.field('OR', { type: 'AdminWhereInput' })
    t.list.field('NOT', { type: 'AdminWhereInput' })
    t.field('username', { type: 'StringFilter' })
    t.field('privilege', { type: 'AdminPrivilegeFilter' })
  }
})

export const AdminOrderByInput = inputObjectType({
  name: 'AdminOrderByInput',
  definition(t) {
    t.field('username', { type: 'OrderByArg' })
    t.field('privilege', { type: 'OrderByArg' })
  }
})

export const AdminPrivilegeFilter = enumFilter('AdminPrivilege')

export const AdminPrivilegeEnum = enumType({
  name: 'AdminPrivilege',
  members: adminPrivileges
})
