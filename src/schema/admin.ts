import path from 'path'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
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
import { Admin, AdminPrivilege } from '../models/Admin'
import { ifUser, isAdmin, isAdminFull } from '../utils/auth'
import { getEnvVar } from '../utils/common'
import { addBaseModelFields, enumFilter, modelTyping } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

const resetPasswordLink = getEnvVar('RESET_PASSWORD_LINK')

export const admin = queryField('admin', {
  type: 'Admin',
  args: {
    id: idArg()
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdminFull(ctx) : isAdmin(ctx)),
  async resolve(_, { id }, { sessionService }) {
    const adminId =
      id != null ? id : sessionService.getSession(true).data.userId

    return Admin.query().findById(adminId)
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
  authorize: ifUser(isAdminFull),
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
  authorize: ifUser(isAdminFull),
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

export const updateAdmin = mutationField('updateAdmin', {
  type: 'Admin',
  args: {
    id: idArg(),
    data: arg({
      type: 'AdminUpdateInput',
      required: true
    })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { id, data }, { sessionService }) {
    const adminId =
      id != null ? id : sessionService.getSession(true).data.userId

    return Admin.query()
      .findById(adminId)
      .patch({
        username: data.username ?? undefined
      })
      .returning('*')
      .first()
  }
})

export const deleteAdmin = mutationField('deleteAdmin', {
  type: 'Boolean',
  args: {
    id: idArg()
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { id }, { sessionService }) {
    const adminId =
      id != null ? id : sessionService.getSession(true).data.userId

    const deleteCount = await Admin.query().deleteById(adminId)

    if (deleteCount <= 0) {
      throw new UserInputError(`Admin not found with id: ${adminId}`)
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
    async resolve(_, { username }, { mailService, passwordService }) {
      const admin = await Admin.query()
        .findOne('username', username)
        .select('id')

      if (admin != null) {
        const resetToken = await passwordService.generateResetToken(admin.id)

        const newLink = resetPasswordLink + resetToken

        await mailService.sendResetPasswordEmail(username, newLink)

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
    const adminId = await passwordService.checkResetToken(resetToken)

    if (adminId != null) {
      const hash = await passwordService.hashPassword(newPassword)

      const patchCount = await Admin.query()
        .findById(adminId)
        .patch({ hash })

      await passwordService.deleteResetToken(resetToken)

      // If no patch, throw to prevent additional Redis access.
      // Redis wouldn't have the user id saved anyway.
      if (patchCount <= 0) {
        throw new UserInputError(`Admin not found with id: ${adminId}`)
      }

      await sessionService.logoutAll(adminId)

      return true
    }

    throw new UserInputError('Invalid reset token')
  }
})

export const updateAdminPassword = mutationField('updateAdminPassword', {
  type: 'Boolean',
  args: {
    id: idArg(),
    oldPassword: stringArg({ required: true }),
    newPassword: stringArg({ required: true })
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdminFull(ctx) : isAdmin(ctx)),
  async resolve(
    _,
    { id, oldPassword, newPassword },
    { passwordService, sessionService }
  ) {
    const adminId =
      id != null ? id : sessionService.getSession(true).data.userId

    const admin = await Admin.query()
      .findById(adminId)
      .select('hash')

    if (admin == null) {
      throw new UserInputError(`Admin not found with id: ${adminId}`)
    }

    if (await passwordService.verifyPassword(admin.hash, oldPassword)) {
      const newHash = await passwordService.hashPassword(newPassword)

      await Admin.query()
        .findById(adminId)
        .patch({ hash: newHash })

      return true
    }

    throw new AuthenticationError('Invalid password')
  }
})

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
      admin == null ||
      !(await passwordService.verifyPassword(admin.hash, password))
    ) {
      throw new AuthenticationError('Invalid username or password')
    }

    await sessionService.login({
      userId: admin.id,
      type: admin.privilege
    })

    return true
  }
})

export const logoutAdmin = mutationField('logoutAdmin', {
  type: 'Boolean',
  authorize: ifUser(isAdmin),
  async resolve(_, __, { sessionService }) {
    await sessionService.logout()

    return true
  }
})

export const AdminType = objectType({
  name: 'Admin',
  rootTyping: modelTyping(Admin),
  definition(t) {
    addBaseModelFields(t)
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
  members: Object.values(AdminPrivilege),
  rootTyping: {
    path: path.join(__dirname, '../models/Admin'),
    name: 'AdminPrivilege'
  }
})
