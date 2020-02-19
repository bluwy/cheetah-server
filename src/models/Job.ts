import { Model, RelationMappings } from 'objection'
import { Assignment } from './Assignment'
import { BaseModel } from './BaseModel'
import { Customer } from './Customer'

export class Job extends BaseModel {
  code!: string

  customer!: Customer
  assignments!: Assignment[]

  static tableName = 'Job'

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
      assignments: {
        relation: Model.HasManyRelation,
        modelClass: Assignment,
        join: {
          from: 'Job.id',
          to: 'Assignment.jobId'
        }
      }
    }
  }
}
