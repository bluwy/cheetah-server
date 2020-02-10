import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { MailService } from './services/mail'
import { PasswordService } from './services/password'
import { SessionService } from './services/session'

export interface Context {
  mail: MailService
  password: PasswordService
  session: SessionService
}

export function context({ req, res }: ExpressContext): Context {
  return {
    mail: new MailService(),
    password: new PasswordService(),
    session: new SessionService(req, res)
  }
}
