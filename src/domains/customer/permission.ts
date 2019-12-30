import { isAdmin, isAdminFull, isVerified } from '../rules'

export const Query = {
  customerCount: isAdmin,
  customer: isVerified,
  customers: isAdmin
}

export const Mutation = {
  createCustomer: isAdmin,
  updateCustomer: isAdmin,
  deleteCustomer: isAdminFull
}
