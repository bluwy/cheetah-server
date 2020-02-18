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
import {
  filterInputNonNullable,
  modelTyping,
  transformObj
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const customer = queryField('customer', {
  type: 'Customer',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    return Customer.query().findById(id)
  }
})

export const customers = queryField('customers', {
  type: 'Customer',
  list: true,
  args: {
    skip: intArg(),
    first: intArg(),
    where: arg({ type: 'CustomerWhereInput' }),
    orderBy: arg({ type: 'CustomerOrderByInput' })
  },
  async resolve(_, { skip, first, where, orderBy }) {
    skip = skip ?? 0
    first = first != null ? Math.min(first, 50) : 10

    return Customer.query()
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where)
      .modify(resolveOrderByInput, orderBy)
  }
})

export const createCustomer = mutationField('createCustomer', {
  type: 'Customer',
  args: {
    data: arg({ type: 'CustomerCreateInput', required: true })
  },
  async resolve(_, { data }) {
    data = transformObj(data, [
      {
        from: 'companyBelongId',
        to: 'companyBelong',
        value: from => {
          from
        }
      },
      {
        from: 'staffPrimaryId',
        to: 'staffPrimary',
        value: from => {
          from
        }
      },
      {
        from: 'staffSecondaryId',
        to: 'staffSecondary',
        value: from => {
          from
        }
      }
    ])

    return Customer.query()
      .insertGraph(data as any)
      .returning('*')
  }
})

export const updateCustomer = mutationField('updateCustomer', {
  type: 'Customer',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'CustomerUpdateInput', required: true })
  },
  async resolve(_, { id, data }) {
    data = filterInputNonNullable(data, [
      'code',
      'name',
      'active',
      'addresses',
      'companyBelongId',
      'staffPrimaryId',
      'staffSecondaryId'
    ])

    data = transformObj(data, [
      {
        from: 'companyBelongId',
        to: 'companyBelong',
        value: from => {
          from
        }
      },
      {
        from: 'staffPrimaryId',
        to: 'staffPrimary',
        value: from => {
          from
        }
      },
      {
        from: 'staffSecondaryId',
        to: 'staffSecondary',
        value: from => {
          from
        }
      }
    ])

    return Customer.query()
      .findById(id)
      .update(data as any)
      .returning('*')
      .first()
  }
})

export const deleteCustomer = mutationField('deleteCustomer', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
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
  rootTyping: modelTyping(Customer),
  definition(t) {
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
  }
})

export const CustomerCreateInput = inputObjectType({
  name: 'CustomerCreateInput',
  definition(t) {
    t.string('code', { required: true })
    t.string('name', { required: true })
    t.boolean('active', { required: true })
    t.list.string('addresses', { required: true })
    t.string('email')
    t.string('phoneNumber')
    t.id('companyBelongId', { required: true })
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId', { required: true })
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
