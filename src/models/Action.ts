import { BaseModel } from './BaseModel'

export class Action extends BaseModel {
  remarks!: string

  static tableName = 'Action'
}
