import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { context } from './context'
import { schema } from './schema'
import './objection'

const app = express()

app.use(cookieParser())

const server = new ApolloServer({ schema, context })

server.applyMiddleware({ app })

app.listen(4000, () => console.log('🚀 Server ready'))
