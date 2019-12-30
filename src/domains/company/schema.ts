import { extendType, objectType, inputObjectType } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.company()
    t.crud.companies({
      filtering: true,
      ordering: true,
      pagination: false
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneCompany({ alias: 'createCompany' })
    t.crud.updateOneCompany({ alias: 'updateCompany' })
    t.crud.deleteOneCompany({ alias: 'deleteCompany' })
  }
})

export const Company = objectType({
  name: 'Company',
  definition (t) {
    t.model.id()
    t.model.name()
    t.model.alias()
  }
})

export const CompanyCreateInput = inputObjectType({
  name: 'CompanyCreateInput',
  definition (t) {
    t.string('name', { required: true })
    t.string('alias', { required: true })
  }
})

export const CompanyUpdateInput = inputObjectType({
  name: 'CompanyUpdateInput',
  definition (t) {
    t.string('name')
    t.string('alias')
  }
})
