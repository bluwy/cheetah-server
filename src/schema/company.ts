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
import { addBaseModelFields } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'

export const company = queryField('company', {
  type: 'Company',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    return Company.query().findById(id)
  }
})

export const companies = queryField('companies', {
  type: 'Company',
  list: true,
  args: {
    skip: intArg(),
    first: intArg(),
    where: arg({ type: 'CompanyWhereInput' }),
    orderBy: arg({ type: 'CompanyOrderByInput' })
  },
  async resolve(_, { skip, first, where, orderBy }) {
    skip = skip ?? 0
    first = first != null ? Math.min(first, 50) : 10

    return Company.query()
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where)
      .modify(resolveOrderByInput, orderBy)
  }
})

export const createCompany = mutationField('createCompany', {
  type: 'Company',
  args: {
    data: arg({ type: 'CompanyCreateInput', required: true })
  },
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
  async resolve(_, { id }) {
    const deleteCount = await Company.query().deleteById(id)

    return deleteCount > 0
  }
})

export const CompanyObject = objectType({
  name: 'Company',
  definition(t) {
    addBaseModelFields(t)
    t.string('name')
    t.string('alias')
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
    t.list.field('AND', { type: 'CompanyWhereInput' })
    t.list.field('OR', { type: 'CompanyWhereInput' })
    t.list.field('NOT', { type: 'CompanyWhereInput' })
    t.field('name', { type: 'StringFilter' })
    t.field('alias', { type: 'StringFilter' })
  }
})

export const CompanyOrderByInput = inputObjectType({
  name: 'CompanyOrderByInput',
  definition(t) {
    t.field('name', { type: 'OrderByArg' })
    t.field('alias', { type: 'OrderByArg' })
  }
})
