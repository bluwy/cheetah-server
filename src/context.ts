import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { DataLoaderService } from './services/dataloader'
import { JobService } from './services/job'
import { PasswordService } from './services/password'
import { SessionService } from './services/session'

export interface Context {
  dataLoaderService: DataLoaderService
  jobService: JobService
  passwordService: PasswordService
  sessionService: SessionService
}

export async function context({ req, res }: ExpressContext): Promise<Context> {
  const sessionService = new SessionService(req, res)
  await sessionService.init()
  return {
    dataLoaderService: new DataLoaderService(),
    jobService: new JobService(),
    passwordService: new PasswordService(),
    sessionService
  }
}
