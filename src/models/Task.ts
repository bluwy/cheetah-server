import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export const taskTypes = [
  'SERVICE',
  'COMPLAINT',
  'DELIVERY',
  'TRANSPORT',
  'OTHERS'
] as const

export type TaskType = typeof taskTypes[number]

export class Task extends BaseModel {
  type!: TaskType
  remarks!: string
  done!: boolean

  assignmentId!: string

  static tableName = 'Task'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['type', 'remarks', 'done'],
    properties: {
      type: { type: 'string' },
      remarks: { type: 'string' },
      done: { type: 'boolean' }
    }
  }
}
