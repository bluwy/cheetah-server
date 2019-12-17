import { Photon } from '@prisma/photon'
import { ApolloServerExpressConfig } from 'apollo-server-express'
import photon from './photon'
import * as auth from './services/auth'
import * as mail from './services/mail'

export interface Context {
  user: auth.UserContext;
  auth: typeof auth;
  mail: typeof mail;
  photon: Photon;
}

const context: ApolloServerExpressConfig['context'] = async ({ req }): Promise<Context> => {
  let user: auth.UserContext | undefined
  const token = req.headers.authorization ?? ''

  if (token) {
    try {
      const decoded = await auth.verifyJwt(token)

      if (typeof decoded === 'object' && auth.isPayloadUser(decoded)) {
        user = new auth.UserContext(decoded)
      }
    } catch {
      // Do nothing, below will create default user context
    }
  }

  if (user == undefined) {
    user = new auth.UserContext()
  }

  return { user, auth, mail, photon }
}

export default context
