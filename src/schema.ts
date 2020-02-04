import path from 'path'
import { makeSchema } from 'nexus'

export const schema = makeSchema({
  types: [],
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
