import { isAdmin, isAdminFull, isVerified } from '../rules'

export const Query = {
  staff: isVerified,
  staffs: isAdmin
}

export const Mutation = {
  createStaff: isAdminFull,
  updateStaff: isAdminFull,
  deleteStaff: isAdminFull,
  resetStaffPassword: isAdminFull
}
