import { OutputDefinitionBlock } from 'nexus/dist/core'
import { arg } from 'nexus'

// Delete botch since Photon can't handle cascading relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deleteOneField (t: OutputDefinitionBlock<'Mutation'>, fieldName: string, whereType: any, table: string): void {
  t.field(fieldName, {
    type: 'Boolean',
    args: {
      where: arg({ type: whereType, required: true })
    },
    async resolve (_, { where }, { db }) {
      let column = ''
      let value = ''

      const valid = Object.entries(where).some(([k, v]) => {
        if (v != null) {
          column = k
          value = v as string
          return true
        } else {
          return false
        }
      })

      if (valid) {
        await db.pool.query(`DELETE FROM ${table} WHERE ${column} = $1`, [value])
        return true
      } else {
        return false
      }
    }
  })
}
