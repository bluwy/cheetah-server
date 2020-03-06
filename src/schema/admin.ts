import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { merge } from 'lodash'
import {
  arg,
  enumType,
  idArg,
  inputObjectType,
  mutationField,
  objectType,
  queryField,
  stringArg
} from 'nexus'
import { Admin, AdminPrivilege } from '../models/Admin'
import { ifUser, isAdmin, isAdminFull } from '../utils/auth'
import {
  addBaseModelFields,
  addBaseModelOrderByFields,
  addBaseModelWhereFields,
  enumFilter
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const adminCount = queryField('adminCount', {
  type: 'Int',
  args: {
    query: stringArg(),
    where: arg({ type: 'AdminWhereInput' })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { query, where }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    const result: any = await Admin.query()
      .alias('a')
      .modify(resolveWhereInput, where, 'a')
      .count('a.id as count')
      .first()

    return result.count
  }
})

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
    query: stringArg(),
    where: arg({ type: 'AdminWhereInput' }),
    orderBy: arg({ type: 'AdminOrderByInput' })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { query, where, orderBy }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    return Admin.query()
      .alias('a')
      .modify(resolveWhereInput, where, 'a')
      .modify(resolveOrderByInput, orderBy, 'a')
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

export const deleteAdmin = mutationField('deleteAdmin', {
  type: 'Boolean',
  args: {
    id: idArg()
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdminFull(ctx) : isAdmin(ctx)),
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

    const admin = await Admin.query().findById(adminId)

    if (admin == null) {
      throw new UserInputError(`Admin not found with id: ${adminId}`)
    }

    if (await passwordService.verifyPassword(admin.hash, oldPassword)) {
      const newHash = await passwordService.hashPassword(newPassword)

      await Admin.query()
        .findById(adminId)
        .patch({ hash: newHash })

      await sessionService.logoutAll(adminId)

      // Once logout all, current session will be invalid, so issue new one
      await sessionService.login({
        userId: admin.id,
        type:
          admin.privilege === AdminPrivilege.Full ? 'ADMIN_FULL' : 'ADMIN_BASIC'
      })

      return true
    }

    throw new AuthenticationError('Invalid password')
  }
})

export const checkAdminSession = mutationField('checkAdminSession', {
  type: 'Boolean',
  async resolve(_, __, { sessionService }) {
    const sessionType = sessionService.getSession()?.data.type

    return sessionType == 'ADMIN_BASIC' || sessionType == 'ADMIN_FULL'
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
      type:
        admin.privilege === AdminPrivilege.Full ? 'ADMIN_FULL' : 'ADMIN_BASIC'
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
  definition(t) {
    addBaseModelFields(t)
    t.string('username')
    t.field('privilege', { type: 'AdminPrivilege' })
  },
  rootTyping: {
    path: '../models/Admin',
    name: 'Admin'
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

export const AdminWhereInput = inputObjectType({
  name: 'AdminWhereInput',
  definition(t) {
    addBaseModelWhereFields(t)
    t.field('username', { type: 'StringFilter' })
    t.field('privilege', { type: 'AdminPrivilegeFilter' })
  }
})

export const AdminOrderByInput = inputObjectType({
  name: 'AdminOrderByInput',
  definition(t) {
    addBaseModelOrderByFields(t)
    t.field('username', { type: 'OrderByArg' })
    t.field('privilege', { type: 'OrderByArg' })
  }
})

export const AdminPrivilegeFilter = enumFilter('AdminPrivilege')

export const AdminPrivilegeEnum = enumType({
  name: 'AdminPrivilege',
  members: Object.values(AdminPrivilege),
  rootTyping: {
    path: '../models/Admin',
    name: 'AdminPrivilege'
  }
})

function queryToWhereInput(query: string) {
  return {
    username: { contains: query }
  }
}
