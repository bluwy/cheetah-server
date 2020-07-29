import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { context } from './context'
import { schema } from './schema'
import './objection'

export const server = new ApolloServer({ schema, context })

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT ?? 4000

  const FRONTEND_URL = process.env.FRONTEND_URL ?? ''

  const app = express()

  app.use(cookieParser())

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
