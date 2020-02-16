import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { DataLoaderService } from './services/dataloader'
import { MailService } from './services/mail'
import { PasswordService } from './services/password'
import { SessionService } from './services/session'

export interface Context {
  dataLoaderService: DataLoaderService
  mailService: MailService
  passwordService: PasswordService
  sessionService: SessionService
}

export async function context({ req, res }: ExpressContext): Promise<Context> {
  return {
    dataLoaderService: new DataLoaderService(),
    mailService: new MailService(),
    passwordService: new PasswordService(),
    sessionService: await SessionService.build(req, res)
  }
}
