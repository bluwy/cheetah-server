import { extendType, objectType } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.company()
    t.crud.companies()
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneCompany()
    t.crud.updateOneCompany()
    t.crud.deleteOneCompany()
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
