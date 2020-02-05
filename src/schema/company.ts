import {
  arg,
  idArg,
  inputObjectType,
  mutationField,
  objectType,
  queryField
} from 'nexus'
import { Company } from '../models/Company'

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
  async resolve() {
    return Company.query()
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
    // Returns delete count
    const result = await Company.query().deleteById(id)
    // True if have deletes
    return result > 0
  }
})

export const CompanyObject = objectType({
  name: 'Company',
  definition(t) {
    t.id('id')
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
