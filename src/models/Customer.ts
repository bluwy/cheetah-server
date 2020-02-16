import { JSONSchema, RelationMappings, Model } from 'objection'
import { BaseModel } from './BaseModel'
import { Company } from './Company'
import { Staff } from './Staff'

export class Customer extends BaseModel {
  code!: string
  name!: string
  active!: boolean
  addresses!: string[]
  email!: string | null
  phoneNumber!: string | null

  companyBelong!: Company
  staffPrimary!: Staff
  staffSecondary!: Staff

  static tableName = 'Customer'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['remarks'],
    properties: {
      code: { type: 'string' },
      name: { type: 'string' },
      active: { type: 'boolean' },
      addresses: { type: 'array', items: { type: 'string' } },
      email: { type: ['string', 'null'] },
      phoneNumber: { type: ['string', 'null'] }
    }
  }

  static relationMappings(): RelationMappings {
    return {
      companyBelong: {
        relation: Model.HasOneRelation,
        modelClass: Company,
        join: {
          from: 'Customer.companyBelongId',
          to: 'Company.id'
        }
      },
      staffPrimary: {
        relation: Model.HasOneRelation,
        modelClass: Staff,
        join: {
          from: 'Customer.staffPrimaryId',
          to: 'Staff.id'
        }
      },
      staffSecondary: {
        relation: Model.HasOneRelation,
        modelClass: Staff,
        join: {
          from: 'Customer.staffSecondaryId',
          to: 'Staff.id'
        }
      }
    }
  }
}
