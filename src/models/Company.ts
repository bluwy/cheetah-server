import { BaseModel } from './BaseModel'

export class Company extends BaseModel {
  name!: string
  alias!: string

  static tableName = 'Company'
}
