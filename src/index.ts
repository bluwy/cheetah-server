import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { context } from './context'
import { schema } from './schema'
import { getEnvVar } from './utils/common'
import './objection'

const sessionSecret = getEnvVar('SESSION_SECRET')

const app = express()

app.use(cookieParser(sessionSecret))

const server = new ApolloServer({ schema, context })

server.applyMiddleware({ app })

app.listen(4000, () => console.log('🚀 Server ready'))
