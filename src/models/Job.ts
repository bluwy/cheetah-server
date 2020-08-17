import { JSONSchema, Model, RelationMappings } from 'objection'
import { Action } from './Action'
import { BaseModel } from './BaseModel'
import { Customer } from './Customer'
import { Staff } from './Staff'
import { Task } from './Task'

// The final state should be either expired or reviewed
export enum JobState {
  // Initial state
  Todo = 'TODO',
  // Done, no further action needed except to be reviewed
  Done = 'DONE',
  // Done but needs follow up
  FollowUp = 'FOLLOW_UP',
  // Job has been reassigned
  Expired = 'EXPIRED',
  // Admin has reviewed results
  Reviewed = 'REVIEWED'
}

export class Job extends BaseModel {
  code!: string
  address!: string
  startDate!: Date
  checkIn!: Date | null
  checkOut!: Date | null
  state!: JobState

  customerId!: string
  staffPrimaryId!: string
  staffSecondaryId!: string | null

  customer!: Customer
  staffPrimary!: Staff
  staffSecondary!: Staff | null
  tasks!: Task[]
  actions!: Action[]

  static tableName = 'Job'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['code', 'address', 'startDate', 'customerId', 'staffPrimaryId'],
    properties: {
      code: { type: 'string' },
      address: { type: 'string' },
      state: { type: 'string', enum: Object.values(JobState) },
      customerId: { type: 'string' },
      staffPrimaryId: { type: 'string' },
      staffSecondaryId: { type: ['string', 'null'] }
    }
  }

  static relationMappings(): RelationMappings {
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'Job.customerId',
          to: 'Customer.id'
        }
      },
      staffPrimary: {
        relation: Model.BelongsToOneRelation,
        modelClass: Staff,
        join: {
          from: 'Job.staffPrimaryId',
          to: 'Staff.id'
        }
      },
      staffSecondary: {
        relation: Model.BelongsToOneRelation,
        modelClass: Staff,
        join: {
          from: 'Job.staffSecondaryId',
          to: 'Staff.id'
        }
      },
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'Job.id',
          to: 'Task.jobId'
        }
      },
      actions: {
        relation: Model.HasManyRelation,
        modelClass: Action,
        join: {
          from: 'Job.id',
          to: 'Action.jobId'
        }
      }
    }
  }
}
