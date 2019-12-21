import { isAdmin, isAdminFull, isVerified } from '../rules'

export const Query = {
  job: isVerified,
  jobs: isAdmin
}

export const Mutation = {
  createJob: isAdmin,
  updateJob: isVerified,
  deleteJob: isAdminFull,
  createAssignment: isAdmin,
  updateAssignment: isAdmin,
  createTask: isAdmin,
  updateTask: isVerified,
  deleteTask: isAdmin,
  createAction: isVerified,
  updateAction: isAdmin,
  deleteAction: isAdmin
}
