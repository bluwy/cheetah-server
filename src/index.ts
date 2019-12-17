require('dotenv').config()
import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import context from './context'
import { schema as genSchema } from './gen-schema'
import { permissions } from './permissions'

const schema = applyMiddleware(genSchema, permissions)

const server = new ApolloServer({ schema, context })

if (process.env.NODE_ENV !== 'test') {
  server.listen().then(({ url }) => {
    console.log('🚀 Server ready at ' + url)
  })
}
