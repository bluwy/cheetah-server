import { AuthenticationError, UserInputError } from 'apollo-server-express'
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
import { ifUser, isAdmin, isAdminFull, isStaff } from '../utils/auth'
import { addBaseModelFields } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const staff = queryField('staff', {
  type: 'Staff',
  args: {
    id: idArg()
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdmin(ctx) : isStaff(ctx)),
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
    where: arg({ type: 'StaffWhereInput' }),
    orderBy: arg({ type: 'StaffOrderByInput' })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { where, orderBy }) {
    return Staff.query()
      .alias('s')
      .modify(resolveWhereInput, where, 's')
      .modify(resolveOrderByInput, orderBy, 's')
  }
})

export const createStaff = mutationField('createStaff', {
  type: 'Staff',
  args: {
    data: arg({
      type: 'StaffCreateInput',
      required: true
    })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { data }, { sessionService }) {
    const staff = await Staff.query()
      .insert(data)
      .returning('*')

    await sessionService.signup(staff.id)

    return staff
  }
})

export const updateStaff = mutationField('updateStaff', {
  type: 'Staff',
  args: {
    id: idArg(),
    data: arg({
      type: 'StaffUpdateInput',
      required: true
    })
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdminFull(ctx) : isStaff(ctx)),
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

export const deleteStaff = mutationField('deleteStaff', {
  type: 'Boolean',
  args: {
    id: idArg()
  },
  authorize: (_, { id }, ctx) => (id != null ? isAdminFull(ctx) : isStaff(ctx)),
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

export const pairStaffAndLogin = mutationField('pairStaffAndLogin', {
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

export const resetStaffPairing = mutationField('resetStaffPairing', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdminFull),
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

export const checkStaffSession = mutationField('checkStaffSession', {
  type: 'Boolean',
  async resolve(_, __, { sessionService }) {
    return sessionService.getSession()?.data.type == 'STAFF'
  }
})

// This should only be called if the user had not login for a long time
// and session had been disconnected
export const loginStaff = mutationField('loginStaff', {
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

export const logoutStaff = mutationField('logoutStaff', {
  type: 'Boolean',
  authorize: ifUser(isStaff),
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
    t.list.field('AND', { type: 'StaffWhereInput' })
    t.list.field('OR', { type: 'StaffWhereInput' })
    t.list.field('NOT', { type: 'StaffWhereInput' })
    t.field('username', { type: 'StringFilter' })
    t.field('fullName', { type: 'StringFilter' })
    t.field('active', { type: 'BooleanFilter' })
  }
})

export const StaffOrderByInput = inputObjectType({
  name: 'StaffOrderByInput',
  definition(t) {
    t.field('username', { type: 'OrderByArg' })
    t.field('fullName', { type: 'OrderByArg' })
    t.field('active', { type: 'OrderByArg' })
  }
})
