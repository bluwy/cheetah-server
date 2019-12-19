import { isAdminFull, isVerified } from '../rules'

export const Query = {
  company: isVerified,
  companies: isAdminFull
}

export const Mutation = {
  createCompany: isAdminFull,
  updateCompany: isAdminFull,
  deleteCompany: isAdminFull
}
