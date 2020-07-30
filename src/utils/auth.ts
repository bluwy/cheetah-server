import { ForbiddenError } from 'apollo-server-express'
import { FieldAuthorizeResolver } from 'nexus'
import { getEnvVar } from '../utils/common'

const SUDO_PASSWORD = getEnvVar('SUDO_PASSWORD')

const AUTH_BYPASS =
  process.env.NODE_ENV === 'development' && !!process.env.AUTH_BYPASS

export enum AuthType {
  Authed = 'AUTHED',
  Staff = 'STAFF',
  Admin = 'ADMIN',
  AdminBasic = 'ADMIN_BASIC',
  AdminFull = 'ADMIN_FULL',
  Sudo = 'SUDO'
}

export function ifIs<
  T extends Parameters<FieldAuthorizeResolver<string, string>>
>(rule: ((...args: T) => AuthType) | AuthType) {
  return (...args: T) => {
    // Ignore authorization in test
    if (process.env.NODE_ENV === 'test' || AUTH_BYPASS) {
      return true
    }

    if (typeof rule === 'function') {
      rule = rule(...args)
    }

    const [, arg, ctx] = args

    switch (rule) {
      case AuthType.Authed:
        return (
          ctx.sessionService.getSession() != null ||
          new ForbiddenError('User is not authenticated')
        )
      case AuthType.Staff:
        return (
          ctx.sessionService.getSession()?.data.type === 'STAFF' ||
          new ForbiddenError('User is not a staff')
        )
      case AuthType.Admin:
        return (
          ctx.sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
          ctx.sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
          new ForbiddenError('User is not an admin')
        )
      case AuthType.AdminBasic:
        return (
          ctx.sessionService.getSession()?.data.type === 'ADMIN_BASIC' ||
          new ForbiddenError('User is not an admin with basic privilege')
        )
      case AuthType.AdminFull:
        return (
          ctx.sessionService.getSession()?.data.type === 'ADMIN_FULL' ||
          new ForbiddenError('User is not an admin with full privilege')
        )
      case AuthType.Sudo:
        return (
          arg.sudoPassword === SUDO_PASSWORD ||
          new ForbiddenError('Sudo password mutations are deprecated')
        )
    }
  }
}
