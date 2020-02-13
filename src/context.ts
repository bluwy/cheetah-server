import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { MailService } from './services/mail'
import { PasswordService } from './services/password'
import { SessionService } from './services/session'

export interface Context {
  mailService: MailService
  passwordService: PasswordService
  sessionService: SessionService
}

export async function context({ req, res }: ExpressContext): Promise<Context> {
  console.log(req.cookies)

  return {
    mailService: new MailService(),
    passwordService: new PasswordService(),
    sessionService: await SessionService.build(req, res)
  }
}
