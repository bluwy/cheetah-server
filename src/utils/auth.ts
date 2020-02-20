import { ForbiddenError } from 'apollo-server-express'
import { Context } from '../context'

type AuthRuleFn = (ctx: Context) => boolean | Error

/** Allows using an auth rule directly on the `authorize` preperty */
export function ifUser(fn: AuthRuleFn) {
  return (_: any, __: any, ctx: Context) => fn(ctx)
}

export const isAuthed: AuthRuleFn = ({ sessionService }) => {
  return (
    sessionService.getSession() != null ||
    new ForbiddenError('User is not authenticated')
  )
}

export const isStaff: AuthRuleFn = ({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'STAFF' ||
    new ForbiddenError('User is not a staff')
  )
}

export const isAdmin: AuthRuleFn = ({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
    sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
    new ForbiddenError('User is not an admin')
  )
}

export const isAdminBasic: AuthRuleFn = ({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
    new ForbiddenError('User is not an admin with basic privilege')
  )
}

export const isAdminFull: AuthRuleFn = ({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
    new ForbiddenError('User is not an admin with full privilege')
  )
}
