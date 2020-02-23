import { UserInputError } from 'apollo-server-express'
import {
  arg,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField
} from 'nexus'
import { Company } from '../models/Company'
import { Customer } from '../models/Customer'
import { Staff } from '../models/Staff'
import { ifUser, isAdmin } from '../utils/auth'
import { addBaseModelFields } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const customerCount = queryField('customerCount', {
  type: 'Int',
  args: {
    where: arg({ type: 'CustomerWhereInput' })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { where }) {
    const result: any = await Customer.query()
      .alias('c')
      .modify(resolveWhereInput, where, 'c')
      .count('c.id as count')
      .first()

    return result.count
  }
})

export const customer = queryField('customer', {
  type: 'Customer',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id }) {
    return Customer.query().findById(id)
  }
})

export const customers = queryField('customers', {
  type: 'Customer',
  list: true,
  args: {
    skip: intArg({ default: 0 }),
    first: intArg({ default: 10 }),
    where: arg({ type: 'CustomerWhereInput' }),
    orderBy: arg({ type: 'CustomerOrderByInput' })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { skip, first, where, orderBy }) {
    if (skip == null) {
      skip = 0
    } else if (skip < 0) {
      throw new UserInputError(`'skip' must be >= 0`)
    }

    if (first == null) {
      first = 10
    } else if (first <= 0 || first > 30) {
      throw new UserInputError(`'first' must be > 0 and <= 30`)
    }

    return Customer.query()
      .alias('c')
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where, 'c')
      .modify(resolveOrderByInput, orderBy, 'c')
  }
})

export const createCustomer = mutationField('createCustomer', {
  type: 'Customer',
  args: {
    data: arg({ type: 'CustomerCreateInput', required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { data }) {
    return Customer.query()
      .insert(data)
      .returning('*')
  }
})

export const updateCustomer = mutationField('updateCustomer', {
  type: 'Customer',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'CustomerUpdateInput', required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id, data }) {
    // Manual undefined to convert null to undefined for non-nullable columns
    return Customer.query()
      .findById(id)
      .patch({
        code: data.code ?? undefined,
        name: data.name ?? undefined,
        active: data.active ?? undefined,
        addresses: data.addresses ?? undefined,
        email: data.email,
        phoneNumber: data.phoneNumber,
        companyBelongId: data.companyBelongId ?? undefined,
        staffPrimaryId: data.staffPrimaryId ?? undefined,
        staffSecondaryId: data.staffSecondaryId
      })
      .returning('*')
      .first()
  }
})

export const deleteCustomer = mutationField('deleteCustomer', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id }) {
    const deleteCount = await Customer.query().deleteById(id)

    if (deleteCount <= 0) {
      throw new UserInputError(`Customer not found with id: ${id}`)
    }

    return deleteCount > 0
  }
})

export const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    addBaseModelFields(t)
    t.string('code')
    t.string('name')
    t.boolean('active')
    t.list.string('addresses')
    t.string('email', { nullable: true })
    t.string('phoneNumber', { nullable: true })
    t.field('companyBelong', {
      type: 'Company',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Customer, Company>(Customer, 'companyBelong')
          .load(root)
      }
    })
    t.field('staffPrimary', {
      type: 'Staff',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Customer, Staff>(Customer, 'staffPrimary')
          .load(root)
      }
    })
    t.field('staffSecondary', {
      type: 'Staff',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Customer, Staff>(Customer, 'staffSecondary')
          .load(root)
      }
    })
  },
  rootTyping: {
    path: '../models/Customer',
    name: 'Customer'
  }
})

export const CustomerCreateInput = inputObjectType({
  name: 'CustomerCreateInput',
  definition(t) {
    t.string('code', { required: true })
    t.string('name', { required: true })
    t.list.string('addresses', { required: true })
    t.string('email')
    t.string('phoneNumber')
    t.id('companyBelongId', { required: true })
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId')
  }
})

export const CustomerUpdateInput = inputObjectType({
  name: 'CustomerUpdateInput',
  definition(t) {
    t.string('code')
    t.string('name')
    t.boolean('active')
    t.list.string('addresses')
    t.string('email')
    t.string('phoneNumber')
    t.id('companyBelongId')
    t.id('staffPrimaryId')
    t.id('staffSecondaryId')
  }
})

export const CustomerWhereInput = inputObjectType({
  name: 'CustomerWhereInput',
  definition(t) {
    t.list.field('AND', { type: 'CustomerWhereInput' })
    t.list.field('OR', { type: 'CustomerWhereInput' })
    t.list.field('NOT', { type: 'CustomerWhereInput' })
    t.field('code', { type: 'StringFilter' })
    t.field('name', { type: 'StringFilter' })
    t.field('active', { type: 'BooleanFilter' })
    t.field('email', { type: 'StringFilter' })
    t.field('phoneNumber', { type: 'StringFilter' })
    t.field('companyBelong', { type: 'CompanyWhereInput' })
    t.field('staffPrimary', { type: 'StaffWhereInput' })
    t.field('staffSecondary', { type: 'StaffWhereInput' })
  }
})

export const CustomerOrderByInput = inputObjectType({
  name: 'CustomerOrderByInput',
  definition(t) {
    t.field('code', { type: 'OrderByArg' })
    t.field('name', { type: 'OrderByArg' })
    t.field('active', { type: 'OrderByArg' })
    t.field('email', { type: 'OrderByArg' })
    t.field('phoneNumber', { type: 'OrderByArg' })
    t.field('companyBelong', { type: 'CompanyOrderByInput' })
    t.field('staffPrimary', { type: 'StaffOrderByInput' })
    t.field('staffSecondary', { type: 'StaffOrderByInput' })
  }
})
