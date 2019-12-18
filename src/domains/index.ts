import fs from 'fs'
import { shield } from 'graphql-shield'
import { merge } from 'lodash'
import path from 'path'

const domainNames = fs.readdirSync(__dirname, { withFileTypes: true }).filter(v => v.isDirectory()).map(v => v.name)

const domainPermissions: NodeRequire[] = []
const domainSchemas: NodeRequire[] = []

domainNames.forEach(domainName => {
  const readFileData = (fileName: string): NodeRequire | undefined =>
    fs.existsSync(path.join(__dirname, domainName, fileName)) ? require(`./${domainName}/${fileName}`) : undefined

  const tryPush = (fileName: string, requireArray: NodeRequire[]): number =>
    requireArray.push(...[readFileData(fileName)].filter((v): v is NodeRequire => v != undefined))

  tryPush('permission.ts', domainPermissions)
  tryPush('schema.ts', domainSchemas)
})

export const permissions = shield(merge({}, ...domainPermissions))
export const schema = domainSchemas
