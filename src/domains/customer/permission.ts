import { isAdmin, isAdminFull, isVerified } from '../rules'

export const Query = {
  customer: isVerified,
  customers: isAdmin
}

export const Mutation = {
  createCustomer: isAdmin,
  updateCustomer: isAdmin,
  deleteCustomer: isAdminFull
}
