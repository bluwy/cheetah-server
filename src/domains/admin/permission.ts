import { isAdmin, isAdminFull } from '../rules'

export const Query = {
  admin: isAdmin,
  admins: isAdminFull
}

export const Mutation = {
  createAdmin: isAdminFull,
  updateAdmin: isAdminFull,
  deleteAdmin: isAdminFull,
  updateAdminPassword: isAdmin
}
