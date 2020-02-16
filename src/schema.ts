import path from 'path'
import { makeSchema } from 'nexus'
import * as base from './schema/base'
import * as admin from './schema/admin'
import * as company from './schema/company'
import * as customer from './schema/customer'
import * as staff from './schema/staff'

export const schema = makeSchema({
  types: [base, admin, company, customer, staff],
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
    ],
    backingTypeMap: {
      DateTime: 'Date'
    }
  }
})
