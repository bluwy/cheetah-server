import { isAdmin, isAdminFull, isVerified } from './rules'

export const Query = {
  staff: isVerified,
  staffs: isAdmin
}

export const Mutation = {
  createOneStaff: isAdminFull,
  updateOneStaff: isAdminFull,
  deleteOneStaff: isAdminFull
}
