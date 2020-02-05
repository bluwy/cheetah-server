import { JSONSchema, Model } from 'objection'

export class Company extends Model {
  id!: string
  name!: string
  alias!: string

  static tableName = 'Company'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'alias'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      alias: { type: 'string' }
    }
  }
}
