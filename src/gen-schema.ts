require('dotenv').config()
import { makeSchema } from 'nexus'
import { nexusPrismaPlugin } from 'nexus-prisma'
import path from 'path'
import pluralize from 'pluralize'
import { schema as allTypes } from './domains'

pluralize.addIrregularRule('staff', 'staffs')

export const schema = makeSchema({
  types: allTypes,
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: path.join(__dirname, 'generated/schema.graphql'),
    typegen: path.join(__dirname, 'generated/nexus.ts')
  },
  typegenAutoConfig: {
    contextType: 'ctx.Context',
    sources: [
      {
        alias: 'ctx',
        source: path.join(__dirname, 'context.ts')
      }
    ]
  }
})
