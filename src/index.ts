import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { context } from './context'
import { schema } from './schema'
import './objection'

const PORT = process.env.PORT ?? 4000

const app = express()

app.use(cookieParser())

const server = new ApolloServer({ schema, context })

server.applyMiddleware({ app })

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
})
