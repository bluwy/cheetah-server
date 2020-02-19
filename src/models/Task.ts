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

  static tableName = 'Task'
}
