import { ForbiddenError } from 'apollo-server'
import { rule } from 'graphql-shield'
import { Context } from '../context'

export const isVerified = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isVerified() || new ForbiddenError('User is not verified')
)

export const isStaff = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isStaff() || new ForbiddenError('User is not a staff')
)

export const isAdmin = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdmin() || new ForbiddenError('User is not an admin')
)

export const isAdminBasic = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdminBasic() || new ForbiddenError('User is not an admin with basic privilege')
)

export const isAdminFull = rule({ cache: 'contextual' })(
  (_, __, { user }: Context) => user.isAdminFull() || new ForbiddenError('User is not an admin with full privilege')
)
