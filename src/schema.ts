import path from 'path'
import { makeSchema } from 'nexus'
import * as company from './schema/company'

export const schema = makeSchema({
  types: [company],
  outputs: {
    schema: path.join(__dirname, 'generated/schema.graphql'),
    typegen: path.join(__dirname, 'generated/nexus.ts')
  },
  prettierConfig: path.join(__dirname, '../.prettierrc'),
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
