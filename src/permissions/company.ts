import { isAdminFull, isVerified } from './rules'

export const Query = {
  company: isVerified,
  companies: isAdminFull
}

export const Mutation = {
  createOneCompany: isAdminFull,
  updateOneCompany: isAdminFull,
  deleteOneCompany: isAdminFull
}
