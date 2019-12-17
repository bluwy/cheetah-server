import { extendType, inputObjectType, objectType } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.staff()
    t.crud.staffs({
      filtering: true,
      ordering: true,
      pagination: true
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneStaff()
    t.crud.updateOneStaff()
    t.crud.deleteOneStaff()
  }
})

export const Staff = objectType({
  name: 'Staff',
  definition (t) {
    t.model.id()
    t.model.username()
    t.model.fullName()
  }
})

export const StaffCreateInput = inputObjectType({
  name: 'StaffCreateInput',
  definition (t) {
    t.string('username')
    t.string('fullName')
  }
})

export const StaffUpdateInput = inputObjectType({
  name: 'StaffUpdateInput',
  definition (t) {
    t.string('username')
    t.string('fullName')
  }
})
