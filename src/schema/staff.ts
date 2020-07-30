import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { merge } from 'lodash'
import {
  arg,
  idArg,
  inputObjectType,
  mutationField,
  objectType,
  queryField,
  stringArg
} from 'nexus'
import { Staff } from '../models/Staff'
import { ifIs, AuthType } from '../utils/auth'
import {
  addBaseModelFields,
  addBaseModelOrderByFields,
  addBaseModelWhereFields
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const staffCount = queryField('staffCount', {
  type: 'Int',
  args: {
    query: stringArg(),
    where: arg({ type: 'StaffWhereInput' })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { query, where }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    const result: any = await Staff.query()
      .alias('s')
      .modify(resolveWhereInput, where, 's')
      .count('s.id as count')
      .first()

    return result.count
  }
})

export const staff = queryField('staff', {
  type: 'Staff',
  args: {
    id: idArg()
  },
  authorize: ifIs((_, { id }) =>
    id != null ? AuthType.Admin : AuthType.Staff
  ),
  async resolve(_, { id }, { sessionService }) {
    const staffId =
      id != null ? id : sessionService.getSession(true).data.userId

    return Staff.query().findById(staffId)
  }
})

export const staffs = queryField('staffs', {
  type: 'Staff',
  list: true,
  args: {
    query: stringArg(),
    where: arg({ type: 'StaffWhereInput' }),
    orderBy: arg({ type: 'StaffOrderByInput' })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { query, where, orderBy }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    return Staff.query()
      .alias('s')
      .modify(resolveWhereInput, where, 's')
      .modify(resolveOrderByInput, orderBy, 's')
  }
})

export const staffCreate = mutationField('staffCreate', {
  type: 'Staff',
  args: {
    data: arg({
      type: 'StaffCreateInput',
      required: true
    })
  },
  authorize: ifIs(AuthType.AdminFull),
  async resolve(_, { data }, { sessionService }) {
    const staff = await Staff.query()
      .insert(data)
      .returning('*')

    await sessionService.signup(staff.id)

    return staff
  }
})

export const staffUpdate = mutationField('staffUpdate', {
  type: 'Staff',
  args: {
    id: idArg(),
    data: arg({
      type: 'StaffUpdateInput',
      required: true
    })
  },
  authorize: ifIs((_, { id }) =>
    id != null ? AuthType.AdminFull : AuthType.Staff
  ),
  async resolve(_, { id, data }, { sessionService }) {
    const staffId =
      id != null ? id : sessionService.getSession(true).data.userId

    return Staff.query()
      .findById(staffId)
      .patch({
        fullName: data.fullName ?? undefined,
        active: data.active ?? undefined
      })
      .returning('*')
      .first()
  }
})

export const staffDelete = mutationField('staffDelete', {
  type: 'Boolean',
  args: {
    id: idArg()
  },
  authorize: ifIs((_, { id }) =>
    id != null ? AuthType.AdminFull : AuthType.Staff
  ),
  async resolve(_, { id }, { sessionService }) {
    const staffId =
      id != null ? id : sessionService.getSession(true).data.userId

    const deleteCount = await Staff.query().deleteById(staffId)

    if (deleteCount <= 0) {
      throw new UserInputError(`Staff not found with id: ${staffId}`)
    }

    return true
  }
})

export const staffPairDevice = mutationField('staffPairDevice', {
  type: 'Boolean',
  args: {
    username: stringArg({ required: true }),
    deviceId: stringArg({ required: true })
  },
  async resolve(_, { username, deviceId }, { sessionService }) {
    const staff = await Staff.query()
      .patch({ deviceId })
      .where('username', username)
      .whereNotNull('deviceId')
      .returning('id')
      .first()

    if (staff == null) {
      throw new UserInputError('Invalid username or already paired')
    }

    await sessionService.login({
      type: 'STAFF',
      userId: staff.id
    })

    return true
  }
})

export const staffResetPairing = mutationField('staffResetPairing', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifIs(AuthType.AdminFull),
  async resolve(_, { id }, { sessionService }) {
    const staff = await Staff.query()
      .findById(id)
      .patch({ deviceId: null })
      .returning('id')
      .first()

    if (staff == null) {
      throw new UserInputError(`Staff not found with id: ${id}`)
    }

    await sessionService.logoutAll(staff.id)

    return true
  }
})

export const staffCheckSession = mutationField('staffCheckSession', {
  type: 'Boolean',
  async resolve(_, __, { sessionService }) {
    return sessionService.getSession()?.data.type == 'STAFF'
  }
})

// This should only be called if the user had not login for a long time
// and session had been disconnected
export const staffLogin = mutationField('staffLogin', {
  type: 'Boolean',
  args: {
    username: stringArg({ required: true }),
    deviceId: stringArg({ required: true })
  },
  async resolve(_, { username, deviceId }, { sessionService }) {
    const staff = await Staff.query()
      .select('id')
      .where('username', username)
      .andWhere('deviceId', deviceId)
      .first()

    if (staff == null) {
      throw new AuthenticationError(`Invalid username or device id`)
    }

    await sessionService.login({
      type: 'STAFF',
      userId: staff.id
    })

    return true
  }
})

export const staffLogout = mutationField('staffLogout', {
  type: 'Boolean',
  authorize: ifIs(AuthType.Staff),
  async resolve(_, __, { sessionService }) {
    await sessionService.logout()

    return true
  }
})

export const StaffType = objectType({
  name: 'Staff',
  definition(t) {
    addBaseModelFields(t)
    t.string('username')
    t.string('fullName')
    t.boolean('active')
    t.boolean('paired', root => root.deviceId != null)
  },
  rootTyping: {
    path: '../models/Staff',
    name: 'Staff'
  }
})

export const StaffCreateInput = inputObjectType({
  name: 'StaffCreateInput',
  definition(t) {
    t.string('username', { required: true })
    t.string('fullName', { required: true })
  }
})

export const StaffUpdateInput = inputObjectType({
  name: 'StaffUpdateInput',
  definition(t) {
    t.string('fullName')
    t.boolean('active')
  }
})

export const StaffWhereInput = inputObjectType({
  name: 'StaffWhereInput',
  definition(t) {
    addBaseModelWhereFields(t)
    t.field('username', { type: 'StringFilter' })
    t.field('fullName', { type: 'StringFilter' })
    t.field('active', { type: 'BooleanFilter' })
  }
})

export const StaffOrderByInput = inputObjectType({
  name: 'StaffOrderByInput',
  definition(t) {
    addBaseModelOrderByFields(t)
    t.field('username', { type: 'OrderByArg' })
    t.field('fullName', { type: 'OrderByArg' })
    t.field('active', { type: 'OrderByArg' })
  }
})

function queryToWhereInput(query: string) {
  return {
    username: { contains: query },
    fullName: { contains: query }
  }
}
