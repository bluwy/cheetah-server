import fs from 'fs'
import { shield } from 'graphql-shield'
import { merge, omit } from 'lodash'

const domainNames = fs.readdirSync(__dirname, { withFileTypes: true }).filter(v => v.isDirectory()).map(v => v.name)

const domainPermissions: NodeRequire[] = []
const domainSchemas: NodeRequire[] = []

domainNames.forEach((domainName) => {
  const readFileData = (fileName: string): NodeRequire | undefined => {
    try {
      return require(`./${domainName}/${fileName}`)
    } catch {
      return undefined
    }
  }

  const tryPush = (fileName: string, requireArray: NodeRequire[]): number =>
    requireArray.push(...[readFileData(fileName)].filter((v): v is NodeRequire => v != null))

  tryPush('permission', domainPermissions)
  tryPush('schema', domainSchemas)
})

// TypeScript compile adds `__esModule`, have to omit :(
export const permissions = shield(omit(merge({}, ...domainPermissions), '__esModule'))
export const schema = domainSchemas
