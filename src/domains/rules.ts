import { ForbiddenError } from 'apollo-server'
import { rule } from 'graphql-shield'
import { Context } from '../context'

export const isVerified = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isVerified() ? true : new ForbiddenError('User is not verified')
)

export const isStaff = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isStaff() ? true : new ForbiddenError('User is not a staff')
)

export const isAdmin = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdmin() ? true : new ForbiddenError('User is not an admin')
)

export const isAdminBasic = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdminBasic() ? true : new ForbiddenError('User is not an admin with basic privilege')
)

export const isAdminFull = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdminFull() ? true : new ForbiddenError('User is not an admin with full privilege')
)
