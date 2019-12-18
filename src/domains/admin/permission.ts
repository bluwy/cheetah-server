import { isAdmin, isAdminFull } from '../rules'

export const Query = {
  admin: isAdmin,
  admins: isAdminFull
}

export const Mutation = {
  createOneAdmin: isAdminFull,
  updateOneAdmin: isAdminFull,
  deleteOneAdmin: isAdminFull
}
