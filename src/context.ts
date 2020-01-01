import { Photon } from '@prisma/photon'
import { ApolloServerExpressConfig } from 'apollo-server-express'
import photon from './photon'
import * as auth from './services/auth'
import * as db from './services/db'
import * as mail from './services/mail'

export interface Context {
  user: auth.UserContext
  auth: typeof auth
  db: typeof db
  mail: typeof mail
  photon: Photon
}

const context: ApolloServerExpressConfig['context'] = async ({ req }): Promise<Context> => {
  let user: auth.UserContext | undefined
  const token = req.headers.authorization

  if (token != null) {
    try {
      const decoded = await auth.verifyJwt(token)

      if (typeof decoded === 'object') {
        user = new auth.UserContext(decoded)
      }
    } catch {
      // Do nothing, below will create default user context
    }
  }

  if (user == null) {
    user = new auth.UserContext()
  }

  return { user, auth, db, mail, photon }
}

export default context
