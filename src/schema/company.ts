import { UserInputError } from 'apollo-server-express'
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
import { Company } from '../models/Company'
import { ifUser, isAdmin, isAdminFull } from '../utils/auth'
import {
  addBaseModelFields,
  addBaseModelOrderByFields,
  addBaseModelWhereFields
} from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const companyCount = queryField('companyCount', {
  type: 'Int',
  args: {
    query: stringArg(),
    where: arg({ type: 'CompanyWhereInput' })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { query, where }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    const result: any = await Company.query()
      .alias('c')
      .modify(resolveWhereInput, where, 'c')
      .count('c.id as count')
      .first()

    return result.count
  }
})

export const company = queryField('company', {
  type: 'Company',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id }) {
    return Company.query().findById(id)
  }
})

export const companies = queryField('companies', {
  type: 'Company',
  list: true,
  args: {
    query: stringArg(),
    where: arg({ type: 'CompanyWhereInput' }),
    orderBy: arg({ type: 'CompanyOrderByInput' })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { query, where, orderBy }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

    return Company.query()
      .alias('c')
      .modify(resolveWhereInput, where, 'c')
      .modify(resolveOrderByInput, orderBy, 'c')
  }
})

export const createCompany = mutationField('createCompany', {
  type: 'Company',
  args: {
    data: arg({ type: 'CompanyCreateInput', required: true })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { data }) {
    return Company.query()
      .insert(data)
      .returning('*')
  }
})

export const deleteCompany = mutationField('deleteCompany', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdminFull),
  async resolve(_, { id }) {
    const deleteCount = await Company.query().deleteById(id)

    if (deleteCount <= 0) {
      throw new UserInputError(`Company not found with id: ${id}`)
    }

    return true
  }
})

export const CompanyType = objectType({
  name: 'Company',
  definition(t) {
    addBaseModelFields(t)
    t.string('name')
    t.string('alias')
  },
  rootTyping: {
    path: '../models/Company',
    name: 'Company'
  }
})

export const CompanyCreateInput = inputObjectType({
  name: 'CompanyCreateInput',
  definition(t) {
    t.string('name', { required: true })
    t.string('alias', { required: true })
  }
})

export const CompanyWhereInput = inputObjectType({
  name: 'CompanyWhereInput',
  definition(t) {
    addBaseModelWhereFields(t)
    t.field('name', { type: 'StringFilter' })
    t.field('alias', { type: 'StringFilter' })
  }
})

export const CompanyOrderByInput = inputObjectType({
  name: 'CompanyOrderByInput',
  definition(t) {
    addBaseModelOrderByFields(t)
    t.field('name', { type: 'OrderByArg' })
    t.field('alias', { type: 'OrderByArg' })
  }
})

function queryToWhereInput(query: string) {
  return {
    name: { contains: query },
    alias: { contains: query }
  }
}
