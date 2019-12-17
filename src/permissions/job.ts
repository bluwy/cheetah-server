import { isAdmin, isAdminFull, isVerified } from './rules'

export const Query = {
  job: isVerified,
  jobs: isAdmin
}

export const Mutation = {
  createOneJob: isAdmin,
  updateOneJob: isVerified,
  deleteOneJob: isAdminFull
}
