import { extendType, objectType, inputObjectType, arg } from 'nexus'
import { deleteOneField } from '../utils'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.int('customerCount', {
      async resolve (_, __, { photon }) {
        return photon.customers.count()
      }
    })
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
    t.field('createCustomer', {
      type: 'Customer',
      args: {
        data: arg({ type: 'CustomerCreateInput', required: true })
      },
      async resolve (_, { data }, { user, photon }) {
        return photon.customers.create({
          data: {
            code: data.code,
            name: data.name,
            email: data.email,
            addresses: data.addresses != null ? { set: data.addresses } : undefined,
            phoneNumber: data.phoneNumber,
            companyBelong: { connect: data.companyBelong },
            active: data.active,
            staffPrimary: { connect: data.staffPrimary },
            staffSecondary: { connect: data.staffSecondary }
          },
          include: {
            companyBelong: true,
            staffPrimary: true,
            staffSecondary: true
          }
        })
      }
    })

    t.field('updateCustomer', {
      type: 'Customer',
      args: {
        data: arg({ type: 'CustomerUpdateInput', required: true }),
        where: arg({ type: 'CustomerWhereUniqueInput', required: true })
      },
      async resolve (_, { data, where }, { user, photon }) {
        return photon.customers.update({
          data: {
            code: data.code,
            name: data.name,
            email: data.email,
            addresses: data.addresses != null ? { set: data.addresses } : undefined,
            phoneNumber: data.phoneNumber,
            companyBelong: { connect: data.companyBelong },
            active: data.active,
            staffPrimary: { connect: data.staffPrimary },
            staffSecondary: { connect: data.staffSecondary }
          },
          include: {
            companyBelong: true,
            staffPrimary: true,
            staffSecondary: true
          },
          where
        })
      }
    })

    deleteOneField(t, 'deleteCustomer', 'CustomerWhereUniqueInput', 'customer')
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
    t.model.active()
    t.model.staffPrimary()
    t.model.staffSecondary()
  }
})

export const CustomerCreateInput = inputObjectType({
  name: 'CustomerCreateInput',
  definition (t) {
    t.string('code', { required: true })
    t.string('name', { required: true })
    t.string('email')
    t.list.string('addresses')
    t.string('phoneNumber')
    t.field('companyBelong', { type: 'CompanyWhereUniqueInput', required: true })
    t.boolean('active')
    t.field('staffPrimary', { type: 'StaffWhereUniqueInput', required: true })
    t.field('staffSecondary', { type: 'StaffWhereUniqueInput' })
  }
})

export const CustomerUpdateInput = inputObjectType({
  name: 'CustomerUpdateInput',
  definition (t) {
    t.string('code')
    t.string('name')
    t.string('email')
    t.list.string('addresses')
    t.string('phoneNumber')
    t.field('companyBelong', { type: 'CompanyWhereUniqueInput' })
    t.boolean('active')
    t.field('staffPrimary', { type: 'StaffWhereUniqueInput' })
    t.field('staffSecondary', { type: 'StaffWhereUniqueInput' })
  }
})
