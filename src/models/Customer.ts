import { RelationMappings, Model } from 'objection'
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
