import { AuthenticationError, UserInputError } from 'apollo-server-express'
import {
  arg,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField,
  stringArg
} from 'nexus'
import { Staff } from '../models/Staff'
import {
  addBaseModelFields,
  filterInputNonNullable,
  modelTyping
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const staff = queryField('staff', {
  type: 'Staff',
  args: {
    id: idArg()
  },
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
    skip: intArg(),
    first: intArg(),
    where: arg({ type: 'StaffWhereInput' }),
    orderBy: arg({ type: 'StaffOrderByInput' })
  },
  async resolve(_, { skip, first, where, orderBy }) {
    skip = skip ?? 0
    first = first != null ? Math.min(first, 50) : 10

    return Staff.query()
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where)
      .modify(resolveOrderByInput, orderBy)
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
  async resolve(_, { id, data }, { sessionService }) {
    const staffId =
      id != null ? id : sessionService.getSession(true).data.userId

    return Staff.query()
      .findById(staffId)
      .patch({
        username: data.username ?? undefined,
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

export const linkStaffDeviceId = mutationField('linkStaffDeviceId', {
  type: 'Boolean',
  args: {
    deviceId: stringArg({ required: true })
  },
  async resolve(_, { deviceId }, { sessionService }) {
    const staffId = sessionService.getSession(true).data.userId

    const updateCount = await Staff.query()
      .findById(staffId)
      .patch({ deviceId })

    if (updateCount <= 0) {
      throw new UserInputError(`Staff not found with id: ${staffId}`)
    }

    return true
  }
})

export const resetStaffDeviceId = mutationField('resetStaffDeviceId', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    const updateCount = await Staff.query()
      .findById(id)
      .patch({ deviceId: null })

    if (updateCount <= 0) {
      throw new UserInputError(`Staff not found with id: ${id}`)
    }

    return true
  }
})

export const loginStaff = mutationField('loginStaff', {
  type: 'Boolean',
  args: {
    deviceId: stringArg({ required: true })
  },
  async resolve(_, { deviceId }, { sessionService }) {
    const staff = await Staff.query()
      .select('id')
      .where('deviceId', deviceId)
      .first()

    if (staff == null) {
      throw new AuthenticationError(`Invalid device id`)
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
  async resolve(_, __, { sessionService }) {
    await sessionService.logout()

    return true
  }
})

export const StaffType = objectType({
  name: 'Staff',
  rootTyping: modelTyping(Staff),
  definition(t) {
    addBaseModelFields(t)
    t.string('username')
    t.string('fullName')
    t.boolean('active')
    t.boolean('linked', root => root.deviceId != null)
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
    t.string('username')
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
