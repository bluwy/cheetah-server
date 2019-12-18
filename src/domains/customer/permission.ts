import { isAdmin, isAdminFull, isVerified } from '../rules'

export const Query = {
  customer: isVerified,
  customers: isAdmin
}

export const Mutation = {
  createOneCustomer: isAdmin,
  updateOneCustomer: isAdmin,
  deleteOneCustomer: isAdminFull
}
