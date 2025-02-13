import { UserInputError } from 'apollo-server-express'
import { merge } from 'lodash'
import {
  arg,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField,
  stringArg
} from '@nexus/schema'
import { Company } from '../models/Company'
import { Customer } from '../models/Customer'
import { Staff } from '../models/Staff'
import { ifIs, AuthType } from '../utils/auth'
import {
  addBaseModelFields,
  addBaseModelOrderByFields,
  addBaseModelWhereFields
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const customerCount = queryField('customerCount', {
  type: 'Int',
  args: {
    query: stringArg(),
    where: arg({ type: 'CustomerWhereInput' })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { query, where }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

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
  authorize: ifIs(AuthType.Admin),
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
    query: stringArg(),
    where: arg({ type: 'CustomerWhereInput' }),
    orderBy: arg({ type: 'CustomerOrderByInput' })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { skip, first, query, where, orderBy }) {
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

    if (query) {
      merge(where, queryToWhereInput(query))
    }

    return Customer.query()
      .alias('c')
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where, 'c')
      .modify(resolveOrderByInput, orderBy, 'c')
  }
})

export const customerCreate = mutationField('customerCreate', {
  type: 'Customer',
  args: {
    data: arg({ type: 'CustomerCreateInput', required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { data }) {
    return Customer.query()
      .insert(data)
      .returning('*')
  }
})

export const customerUpdate = mutationField('customerUpdate', {
  type: 'Customer',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'CustomerUpdateInput', required: true })
  },
  authorize: ifIs(AuthType.Admin),
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

export const customerDelete = mutationField('customerDelete', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifIs(AuthType.Admin),
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
      nullable: true,
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
    addBaseModelWhereFields(t)
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
    addBaseModelOrderByFields(t)
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

function queryToWhereInput(query: string) {
  return {
    code: { contains: query },
    name: { contains: query },
    email: { contains: query },
    phoneNumber: { contains: query }
  }
}
