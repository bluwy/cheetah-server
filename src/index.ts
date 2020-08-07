import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { context } from './context'
import { cleanupDatabase, reseedDatabase } from './database'
import { schema } from './schema'

export const server = new ApolloServer({ schema, context })

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT ?? 4000

  const FRONTEND_URL = process.env.FRONTEND_URL ?? ''

  const app = express()

  app.use(cookieParser())

  if (process.env.NODE_ENV === 'development') {
    // Manually re-seed database if needed. Make sure they're no queries running
    // on the database before calling this.
    app.all('/reseed', () => reseedDatabase())
    // Disconnect and drop the database. Since the PostgreSQL database created
    // with Docker is volatile, it isn't necessary to call this.
    app.all('/cleanup', () => cleanupDatabase())
  }

  server.applyMiddleware({
    app,
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  })

  app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  })
}
