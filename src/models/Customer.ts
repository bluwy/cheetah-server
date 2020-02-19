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

  companyBelongId!: string
  staffPrimaryId!: string
  staffSecondaryId!: string

  companyBelong!: Company
  staffPrimary!: Staff
  staffSecondary!: Staff

  static tableName = 'Customer'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: [
      'code',
      'name',
      'active',
      'addresses',
      'companyBelongId',
      'staffPrimaryId',
      'staffSecondaryId'
    ],
    properties: {
      code: { type: 'string' },
      name: { type: 'string' },
      active: { type: 'boolean' },
      addresses: { type: 'array', items: { type: 'string' } },
      email: { type: ['string', 'null'] },
      phoneNumber: { type: ['string', 'null'] },
      companyBelongId: { type: 'string' },
      staffPrimaryId: { type: 'string' },
      staffSecondaryId: { type: 'string' }
    }
  }

  static relationMappings(): RelationMappings {
    return {
      companyBelong: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'Customer.companyBelongId',
          to: 'Company.id'
        }
      },
      staffPrimary: {
        relation: Model.BelongsToOneRelation,
        modelClass: Staff,
        join: {
          from: 'Customer.staffPrimaryId',
          to: 'Staff.id'
        }
      },
      staffSecondary: {
        relation: Model.BelongsToOneRelation,
        modelClass: Staff,
        join: {
          from: 'Customer.staffSecondaryId',
          to: 'Staff.id'
        }
      }
    }
  }
}
