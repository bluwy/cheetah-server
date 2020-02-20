import { ForbiddenError } from 'apollo-server-express'
import { Context } from '../context'

type AuthRuleFn = (ctx: Context) => boolean | Error

const authBypass = process.env['AUTH_BYPASS']

/** Allows using an auth rule directly on the `authorize` preperty */
export function ifUser(fn: AuthRuleFn) {
  return (_: any, __: any, ctx: Context) => fn(ctx)
}

export const isAuthed = authRule(({ sessionService }) => {
  return (
    sessionService.getSession() != null ||
    new ForbiddenError('User is not authenticated')
  )
})

export const isStaff = authRule(({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'STAFF' ||
    new ForbiddenError('User is not a staff')
  )
})

export const isAdmin = authRule(({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
    sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
    new ForbiddenError('User is not an admin')
  )
})

export const isAdminBasic = authRule(({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
    new ForbiddenError('User is not an admin with basic privilege')
  )
})

export const isAdminFull = authRule(({ sessionService }) => {
  return (
    sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
    new ForbiddenError('User is not an admin with full privilege')
  )
})

function authRule(fn: AuthRuleFn): AuthRuleFn {
  return ctx => !!authBypass || fn(ctx)
}
