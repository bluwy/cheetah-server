import { extendType, objectType } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.customer()
    t.crud.customers({
      filtering: true,
      ordering: true,
      pagination: true
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneCustomer()
    t.crud.updateOneCustomer()
    t.crud.deleteOneCustomer()
  }
})

export const Customer = objectType({
  name: 'Customer',
  definition (t) {
    t.model.id()
    t.model.code()
    t.model.name()
    t.model.email()
    t.model.addresses()
    t.model.phoneNumber()
    t.model.companyBelong()
    t.model.temporary()
    t.model.active()
    t.model.staffPrimary()
    t.model.staffSecondary()
  }
})

export const Address = objectType({
  name: 'Address',
  definition (t) {
    t.model.id()
    t.model.text()
  }
})
