import { JSONSchema, Model, RelationMappings } from 'objection'
import { Action } from './Action'
import { BaseModel } from './BaseModel'
import { Staff } from './Staff'
import { Task } from './Task'

export class Assignment extends BaseModel {
  address!: string
  preferTime!: Date | null
  checkIn!: Date | null
  checkOut!: Date | null
  expired!: boolean

  staffPrimary!: Staff
  staffSecondary!: Staff
  tasks!: Task[]
  actions!: Action[]

  static tableName = 'Assignment'

  static jsonSchema: JSONSchema = {
    type: 'object',
    properties: {
      address: { type: 'string' },
      expired: { type: 'boolean' }
    }
  }

  static relationMappings(): RelationMappings {
    return {
      staffPrimary: {
        relation: Model.HasOneRelation,
        modelClass: Staff,
        join: {
          from: 'Assignment.staffPrimaryId',
          to: 'Staff.id'
        }
      },
      staffSecondary: {
        relation: Model.HasOneRelation,
        modelClass: Staff,
        join: {
          from: 'Assignment.staffSecondaryId',
          to: 'Staff.id'
        }
      },
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'Assignment.id',
          to: 'Task.assignmentId'
        }
      },
      actions: {
        relation: Model.HasManyRelation,
        modelClass: Action,
        join: {
          from: 'Assignment.id',
          to: 'Action.assignmentId'
        }
      }
    }
  }
}
