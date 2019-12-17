import { enumType, extendType, inputObjectType, objectType } from 'nexus'
import { AdminPrivilege as EnumAdminPrivilege } from '../services/auth'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.admin()
    t.crud.admins({
      filtering: true,
      ordering: true,
      pagination: true
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneAdmin()
    t.crud.updateOneAdmin()
    t.crud.deleteOneAdmin()
  }
})

export const Admin = objectType({
  name: 'Admin',
  definition (t) {
    t.model.id()
    t.model.username()
    t.model.privilege()
  }
})

export const AdminCreateInput = inputObjectType({
  name: 'AdminCreateInput',
  definition (t) {
    t.string('username')
  }
})

export const AdminUpdateInput = inputObjectType({
  name: 'AdminUpdateInput',
  definition (t) {
    t.string('username')
  }
})

export const AdminPrivilege = enumType({
  name: 'AdminPrivilege',
  members: EnumAdminPrivilege
})
