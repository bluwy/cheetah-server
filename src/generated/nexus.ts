/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from '../context'
import { Admin, AdminPrivilege } from '../models/Admin'
import { Company } from '../models/Company'
import { Customer } from '../models/Customer'
import { Job, JobState } from '../models/Job'
import { Task, TaskType } from '../models/Task'
import { Action } from '../models/Action'
import { Staff } from '../models/Staff'
import { FieldAuthorizeResolver } from 'nexus/dist/plugins/fieldAuthorizePlugin'
import { core } from 'nexus'
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    date<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.ScalarInputFieldConfig<
        core.GetGen3<'inputTypes', TypeName, FieldName>
      >
    ): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    date<FieldName extends string>(
      fieldName: FieldName,
      ...opts: core.ScalarOutSpread<TypeName, FieldName>
    ): void // "DateTime";
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ActionInput: {
    // input type
    id?: string | null // ID
    remarks?: string | null // String
  }
  AdminCreateInput: {
    // input type
    password: string // String!
    privilege: NexusGenEnums['AdminPrivilege'] // AdminPrivilege!
    username: string // String!
  }
  AdminOrderByInput: {
    // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    privilege?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    username?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  AdminPrivilegeFilter: {
    // input type
    equals?: NexusGenEnums['AdminPrivilege'] | null // AdminPrivilege
    in?: NexusGenEnums['AdminPrivilege'][] | null // [AdminPrivilege!]
    not?: NexusGenEnums['AdminPrivilege'] | null // AdminPrivilege
    notIn?: NexusGenEnums['AdminPrivilege'][] | null // [AdminPrivilege!]
  }
  AdminWhereInput: {
    // input type
    AND?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    NOT?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    OR?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    privilege?: NexusGenInputs['AdminPrivilegeFilter'] | null // AdminPrivilegeFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    username?: NexusGenInputs['StringFilter'] | null // StringFilter
  }
  BooleanFilter: {
    // input type
    equals?: boolean | null // Boolean
    not?: boolean | null // Boolean
  }
  CompanyCreateInput: {
    // input type
    alias: string // String!
    name: string // String!
  }
  CompanyOrderByInput: {
    // input type
    alias?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    createdAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  CompanyWhereInput: {
    // input type
    alias?: NexusGenInputs['StringFilter'] | null // StringFilter
    AND?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    name?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
    OR?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
  }
  CustomerCreateInput: {
    // input type
    addresses: string[] // [String!]!
    code: string // String!
    companyBelongId: string // ID!
    email?: string | null // String
    name: string // String!
    phoneNumber?: string | null // String
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
  }
  CustomerOrderByInput: {
    // input type
    active?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    code?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    companyBelong?: NexusGenInputs['CompanyOrderByInput'] | null // CompanyOrderByInput
    createdAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    email?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    phoneNumber?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    staffPrimary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    staffSecondary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    updatedAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  CustomerUpdateInput: {
    // input type
    active?: boolean | null // Boolean
    addresses?: string[] | null // [String!]
    code?: string | null // String
    companyBelongId?: string | null // ID
    email?: string | null // String
    name?: string | null // String
    phoneNumber?: string | null // String
    staffPrimaryId?: string | null // ID
    staffSecondaryId?: string | null // ID
  }
  CustomerWhereInput: {
    // input type
    active?: NexusGenInputs['BooleanFilter'] | null // BooleanFilter
    AND?: NexusGenInputs['CustomerWhereInput'][] | null // [CustomerWhereInput!]
    code?: NexusGenInputs['StringFilter'] | null // StringFilter
    companyBelong?: NexusGenInputs['CompanyWhereInput'] | null // CompanyWhereInput
    createdAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    email?: NexusGenInputs['StringFilter'] | null // StringFilter
    name?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['CustomerWhereInput'][] | null // [CustomerWhereInput!]
    OR?: NexusGenInputs['CustomerWhereInput'][] | null // [CustomerWhereInput!]
    phoneNumber?: NexusGenInputs['StringFilter'] | null // StringFilter
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
  }
  DateTimeFilter: {
    // input type
    equals?: Date | null // DateTime
    gt?: Date | null // DateTime
    gte?: Date | null // DateTime
    in?: Date[] | null // [DateTime!]
    lt?: Date | null // DateTime
    lte?: Date | null // DateTime
    not?: Date | null // DateTime
    notIn?: Date[] | null // [DateTime!]
  }
  FloatFilter: {
    // input type
    equals?: number | null // Float
    gt?: number | null // Float
    gte?: number | null // Float
    in?: number[] | null // [Float!]
    lt?: number | null // Float
    lte?: number | null // Float
    not?: number | null // Float
    notIn?: number[] | null // [Float!]
  }
  IntFilter: {
    // input type
    equals?: number | null // Int
    gt?: number | null // Int
    gte?: number | null // Int
    in?: number[] | null // [Int!]
    lt?: number | null // Int
    lte?: number | null // Int
    not?: number | null // Int
    notIn?: number[] | null // [Int!]
  }
  JobCreateInput: {
    // input type
    address: string // String!
    customerId: string // ID!
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
    startDate: Date // DateTime!
    tasks: NexusGenInputs['TaskCreateInput'][] // [TaskCreateInput!]!
  }
  JobOrderByInput: {
    // input type
    address?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    checkIn?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    checkOut?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    code?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    createdAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    customer?: NexusGenInputs['CustomerOrderByInput'] | null // CustomerOrderByInput
    staffPrimary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    staffSecondary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    startDate?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    state?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  JobReassignInput: {
    // input type
    address: string // String!
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
    startDate: Date // DateTime!
    tasks: NexusGenInputs['TaskCreateInput'][] // [TaskCreateInput!]!
  }
  JobStateFilter: {
    // input type
    equals?: NexusGenEnums['JobState'] | null // JobState
    in?: NexusGenEnums['JobState'][] | null // [JobState!]
    not?: NexusGenEnums['JobState'] | null // JobState
    notIn?: NexusGenEnums['JobState'][] | null // [JobState!]
  }
  JobUpdateByAdminInput: {
    // input type
    address?: string | null // String
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
    customerId?: string | null // ID
    staffPrimaryId?: string | null // ID
    staffSecondaryId?: string | null // ID
    startDate?: Date | null // DateTime
    state?: NexusGenEnums['JobState'] | null // JobState
  }
  JobUpdateByStaffInput: {
    // input type
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
    state?: NexusGenEnums['JobState'] | null // JobState
  }
  JobWhereInput: {
    // input type
    address?: NexusGenInputs['StringFilter'] | null // StringFilter
    AND?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    checkIn?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    checkOut?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    code?: NexusGenInputs['StringFilter'] | null // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    customer?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    NOT?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    OR?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    startDate?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    state?: NexusGenInputs['JobStateFilter'] | null // JobStateFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
  }
  StaffCreateInput: {
    // input type
    fullName: string // String!
    username: string // String!
  }
  StaffOrderByInput: {
    // input type
    active?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    createdAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    fullName?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    username?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  StaffUpdateInput: {
    // input type
    active?: boolean | null // Boolean
    fullName?: string | null // String
  }
  StaffWhereInput: {
    // input type
    active?: NexusGenInputs['BooleanFilter'] | null // BooleanFilter
    AND?: NexusGenInputs['StaffWhereInput'][] | null // [StaffWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    fullName?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['StaffWhereInput'][] | null // [StaffWhereInput!]
    OR?: NexusGenInputs['StaffWhereInput'][] | null // [StaffWhereInput!]
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    username?: NexusGenInputs['StringFilter'] | null // StringFilter
  }
  StringFilter: {
    // input type
    contains?: string | null // String
    endsWith?: string | null // String
    equals?: string | null // String
    gt?: string | null // String
    gte?: string | null // String
    in?: string[] | null // [String!]
    lt?: string | null // String
    lte?: string | null // String
    not?: string | null // String
    notIn?: string[] | null // [String!]
    startsWith?: string | null // String
  }
  TaskCreateInput: {
    // input type
    remarks: string // String!
    type: NexusGenEnums['TaskType'] // TaskType!
  }
  TaskInput: {
    // input type
    done?: boolean | null // Boolean
    id?: string | null // ID
    remarks?: string | null // String
    type?: NexusGenEnums['TaskType'] | null // TaskType
  }
  TaskTypeFilter: {
    // input type
    equals?: NexusGenEnums['TaskType'] | null // TaskType
    in?: NexusGenEnums['TaskType'][] | null // [TaskType!]
    not?: NexusGenEnums['TaskType'] | null // TaskType
    notIn?: NexusGenEnums['TaskType'][] | null // [TaskType!]
  }
}

export interface NexusGenEnums {
  AdminPrivilege: AdminPrivilege
  JobState: JobState
  OrderByArg: 'ASC' | 'DESC'
  TaskType: TaskType
}

export interface NexusGenRootTypes {
  Action: Action
  Admin: Admin
  Company: Company
  Customer: Customer
  Job: Job
  JobReassignResponse: {
    // root type
    newJob: NexusGenRootTypes['Job'] // Job!
    oriJob: NexusGenRootTypes['Job'] // Job!
  }
  Mutation: {}
  Query: {}
  Staff: Staff
  Task: Task
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  ActionInput: NexusGenInputs['ActionInput']
  AdminCreateInput: NexusGenInputs['AdminCreateInput']
  AdminOrderByInput: NexusGenInputs['AdminOrderByInput']
  AdminPrivilegeFilter: NexusGenInputs['AdminPrivilegeFilter']
  AdminWhereInput: NexusGenInputs['AdminWhereInput']
  BooleanFilter: NexusGenInputs['BooleanFilter']
  CompanyCreateInput: NexusGenInputs['CompanyCreateInput']
  CompanyOrderByInput: NexusGenInputs['CompanyOrderByInput']
  CompanyWhereInput: NexusGenInputs['CompanyWhereInput']
  CustomerCreateInput: NexusGenInputs['CustomerCreateInput']
  CustomerOrderByInput: NexusGenInputs['CustomerOrderByInput']
  CustomerUpdateInput: NexusGenInputs['CustomerUpdateInput']
  CustomerWhereInput: NexusGenInputs['CustomerWhereInput']
  DateTimeFilter: NexusGenInputs['DateTimeFilter']
  FloatFilter: NexusGenInputs['FloatFilter']
  IntFilter: NexusGenInputs['IntFilter']
  JobCreateInput: NexusGenInputs['JobCreateInput']
  JobOrderByInput: NexusGenInputs['JobOrderByInput']
  JobReassignInput: NexusGenInputs['JobReassignInput']
  JobStateFilter: NexusGenInputs['JobStateFilter']
  JobUpdateByAdminInput: NexusGenInputs['JobUpdateByAdminInput']
  JobUpdateByStaffInput: NexusGenInputs['JobUpdateByStaffInput']
  JobWhereInput: NexusGenInputs['JobWhereInput']
  StaffCreateInput: NexusGenInputs['StaffCreateInput']
  StaffOrderByInput: NexusGenInputs['StaffOrderByInput']
  StaffUpdateInput: NexusGenInputs['StaffUpdateInput']
  StaffWhereInput: NexusGenInputs['StaffWhereInput']
  StringFilter: NexusGenInputs['StringFilter']
  TaskCreateInput: NexusGenInputs['TaskCreateInput']
  TaskInput: NexusGenInputs['TaskInput']
  TaskTypeFilter: NexusGenInputs['TaskTypeFilter']
  AdminPrivilege: NexusGenEnums['AdminPrivilege']
  JobState: NexusGenEnums['JobState']
  OrderByArg: NexusGenEnums['OrderByArg']
  TaskType: NexusGenEnums['TaskType']
}

export interface NexusGenFieldTypes {
  Action: {
    // field return type
    createdAt: Date // DateTime!
    id: string // ID!
    remarks: string // String!
    updatedAt: Date // DateTime!
  }
  Admin: {
    // field return type
    createdAt: Date // DateTime!
    id: string // ID!
    privilege: NexusGenEnums['AdminPrivilege'] // AdminPrivilege!
    updatedAt: Date // DateTime!
    username: string // String!
  }
  Company: {
    // field return type
    alias: string // String!
    createdAt: Date // DateTime!
    id: string // ID!
    name: string // String!
    updatedAt: Date // DateTime!
  }
  Customer: {
    // field return type
    active: boolean // Boolean!
    addresses: string[] // [String!]!
    code: string // String!
    companyBelong: NexusGenRootTypes['Company'] // Company!
    createdAt: Date // DateTime!
    email: string | null // String
    id: string // ID!
    name: string // String!
    phoneNumber: string | null // String
    staffPrimary: NexusGenRootTypes['Staff'] // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] | null // Staff
    updatedAt: Date // DateTime!
  }
  Job: {
    // field return type
    actions: NexusGenRootTypes['Action'][] // [Action!]!
    address: string // String!
    checkIn: Date | null // DateTime
    checkOut: Date | null // DateTime
    code: string // String!
    createdAt: Date // DateTime!
    customer: NexusGenRootTypes['Customer'] // Customer!
    id: string // ID!
    staffPrimary: NexusGenRootTypes['Staff'] // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] | null // Staff
    startDate: Date // DateTime!
    state: NexusGenEnums['JobState'] // JobState!
    tasks: NexusGenRootTypes['Task'][] // [Task!]!
    updatedAt: Date // DateTime!
  }
  JobReassignResponse: {
    // field return type
    newJob: NexusGenRootTypes['Job'] // Job!
    oriJob: NexusGenRootTypes['Job'] // Job!
  }
  Mutation: {
    // field return type
    adminCreate: NexusGenRootTypes['Admin'] // Admin!
    adminDelete: boolean // Boolean!
    adminGetResetPasswordToken: string // String!
    adminLogin: boolean // Boolean!
    adminLogout: boolean // Boolean!
    adminResetPassword: boolean // Boolean!
    adminUpdatePassword: boolean // Boolean!
    companyCreate: NexusGenRootTypes['Company'] // Company!
    companyDelete: boolean // Boolean!
    customerCreate: NexusGenRootTypes['Customer'] // Customer!
    customerDelete: boolean // Boolean!
    customerUpdate: NexusGenRootTypes['Customer'] // Customer!
    jobCreate: NexusGenRootTypes['Job'] // Job!
    jobDelete: boolean // Boolean!
    jobReassign: NexusGenRootTypes['JobReassignResponse'] // JobReassignResponse!
    jobSetActions: boolean // Boolean!
    jobSetTasks: boolean // Boolean!
    jobSetTasksDone: boolean // Boolean!
    jobUpdateByAdmin: NexusGenRootTypes['Job'] // Job!
    jobUpdateByStaff: NexusGenRootTypes['Job'] // Job!
    staffCreate: NexusGenRootTypes['Staff'] // Staff!
    staffDelete: boolean // Boolean!
    staffLogin: boolean // Boolean!
    staffLogout: boolean // Boolean!
    staffPairDevice: boolean // Boolean!
    staffResetPairing: boolean // Boolean!
    staffUpdate: NexusGenRootTypes['Staff'] // Staff!
  }
  Query: {
    // field return type
    admin: NexusGenRootTypes['Admin'] // Admin!
    adminCount: number // Int!
    adminIsInSession: boolean // Boolean!
    admins: NexusGenRootTypes['Admin'][] // [Admin!]!
    companies: NexusGenRootTypes['Company'][] // [Company!]!
    company: NexusGenRootTypes['Company'] // Company!
    companyCount: number // Int!
    customer: NexusGenRootTypes['Customer'] // Customer!
    customerCount: number // Int!
    customers: NexusGenRootTypes['Customer'][] // [Customer!]!
    job: NexusGenRootTypes['Job'] // Job!
    jobCount: number // Int!
    jobs: NexusGenRootTypes['Job'][] // [Job!]!
    staff: NexusGenRootTypes['Staff'] // Staff!
    staffCount: number // Int!
    staffIsInSession: boolean // Boolean!
    staffs: NexusGenRootTypes['Staff'][] // [Staff!]!
  }
  Staff: {
    // field return type
    active: boolean // Boolean!
    createdAt: Date // DateTime!
    fullName: string // String!
    id: string // ID!
    paired: boolean // Boolean!
    updatedAt: Date // DateTime!
    username: string // String!
  }
  Task: {
    // field return type
    createdAt: Date // DateTime!
    done: boolean // Boolean!
    id: string // ID!
    remarks: string // String!
    type: NexusGenEnums['TaskType'] // TaskType!
    updatedAt: Date // DateTime!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    adminCreate: {
      // args
      data: NexusGenInputs['AdminCreateInput'] // AdminCreateInput!
      sudoPassword?: string | null // String
    }
    adminDelete: {
      // args
      id?: string | null // ID
    }
    adminGetResetPasswordToken: {
      // args
      sudoPassword: string // String!
      username: string // String!
    }
    adminLogin: {
      // args
      password: string // String!
      username: string // String!
    }
    adminResetPassword: {
      // args
      newPassword: string // String!
      resetToken: string // String!
    }
    adminUpdatePassword: {
      // args
      id?: string | null // ID
      newPassword: string // String!
      oldPassword: string // String!
    }
    companyCreate: {
      // args
      data: NexusGenInputs['CompanyCreateInput'] // CompanyCreateInput!
    }
    companyDelete: {
      // args
      id: string // ID!
    }
    customerCreate: {
      // args
      data: NexusGenInputs['CustomerCreateInput'] // CustomerCreateInput!
    }
    customerDelete: {
      // args
      id: string // ID!
    }
    customerUpdate: {
      // args
      data: NexusGenInputs['CustomerUpdateInput'] // CustomerUpdateInput!
      id: string // ID!
    }
    jobCreate: {
      // args
      data: NexusGenInputs['JobCreateInput'] // JobCreateInput!
    }
    jobDelete: {
      // args
      id: string // ID!
    }
    jobReassign: {
      // args
      data: NexusGenInputs['JobReassignInput'] // JobReassignInput!
      id: string // ID!
    }
    jobSetActions: {
      // args
      data: NexusGenInputs['ActionInput'][] // [ActionInput!]!
      jobId: string // ID!
    }
    jobSetTasks: {
      // args
      data: NexusGenInputs['TaskInput'][] // [TaskInput!]!
      jobId: string // ID!
    }
    jobSetTasksDone: {
      // args
      ids: string[] // [ID!]!
    }
    jobUpdateByAdmin: {
      // args
      data: NexusGenInputs['JobUpdateByAdminInput'] // JobUpdateByAdminInput!
      id: string // ID!
    }
    jobUpdateByStaff: {
      // args
      data: NexusGenInputs['JobUpdateByStaffInput'] // JobUpdateByStaffInput!
      id: string // ID!
    }
    staffCreate: {
      // args
      data: NexusGenInputs['StaffCreateInput'] // StaffCreateInput!
    }
    staffDelete: {
      // args
      id?: string | null // ID
    }
    staffLogin: {
      // args
      deviceId: string // String!
      username: string // String!
    }
    staffPairDevice: {
      // args
      deviceId: string // String!
      username: string // String!
    }
    staffResetPairing: {
      // args
      id: string // ID!
    }
    staffUpdate: {
      // args
      data: NexusGenInputs['StaffUpdateInput'] // StaffUpdateInput!
      id?: string | null // ID
    }
  }
  Query: {
    admin: {
      // args
      id?: string | null // ID
    }
    adminCount: {
      // args
      query?: string | null // String
      where?: NexusGenInputs['AdminWhereInput'] | null // AdminWhereInput
    }
    admins: {
      // args
      orderBy?: NexusGenInputs['AdminOrderByInput'] | null // AdminOrderByInput
      query?: string | null // String
      where?: NexusGenInputs['AdminWhereInput'] | null // AdminWhereInput
    }
    companies: {
      // args
      orderBy?: NexusGenInputs['CompanyOrderByInput'] | null // CompanyOrderByInput
      query?: string | null // String
      where?: NexusGenInputs['CompanyWhereInput'] | null // CompanyWhereInput
    }
    company: {
      // args
      id: string // ID!
    }
    companyCount: {
      // args
      query?: string | null // String
      where?: NexusGenInputs['CompanyWhereInput'] | null // CompanyWhereInput
    }
    customer: {
      // args
      id: string // ID!
    }
    customerCount: {
      // args
      query?: string | null // String
      where?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    }
    customers: {
      // args
      first?: number | null // Int
      orderBy?: NexusGenInputs['CustomerOrderByInput'] | null // CustomerOrderByInput
      query?: string | null // String
      skip?: number | null // Int
      where?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    }
    job: {
      // args
      id: string // ID!
    }
    jobCount: {
      // args
      query?: string | null // String
      where?: NexusGenInputs['JobWhereInput'] | null // JobWhereInput
    }
    jobs: {
      // args
      first?: number | null // Int
      orderBy?: NexusGenInputs['JobOrderByInput'] | null // JobOrderByInput
      query?: string | null // String
      skip?: number | null // Int
      where?: NexusGenInputs['JobWhereInput'] | null // JobWhereInput
    }
    staff: {
      // args
      id?: string | null // ID
    }
    staffCount: {
      // args
      query?: string | null // String
      where?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    }
    staffs: {
      // args
      orderBy?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
      query?: string | null // String
      where?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | 'Action'
  | 'Admin'
  | 'Company'
  | 'Customer'
  | 'Job'
  | 'JobReassignResponse'
  | 'Mutation'
  | 'Query'
  | 'Staff'
  | 'Task'

export type NexusGenInputNames =
  | 'ActionInput'
  | 'AdminCreateInput'
  | 'AdminOrderByInput'
  | 'AdminPrivilegeFilter'
  | 'AdminWhereInput'
  | 'BooleanFilter'
  | 'CompanyCreateInput'
  | 'CompanyOrderByInput'
  | 'CompanyWhereInput'
  | 'CustomerCreateInput'
  | 'CustomerOrderByInput'
  | 'CustomerUpdateInput'
  | 'CustomerWhereInput'
  | 'DateTimeFilter'
  | 'FloatFilter'
  | 'IntFilter'
  | 'JobCreateInput'
  | 'JobOrderByInput'
  | 'JobReassignInput'
  | 'JobStateFilter'
  | 'JobUpdateByAdminInput'
  | 'JobUpdateByStaffInput'
  | 'JobWhereInput'
  | 'StaffCreateInput'
  | 'StaffOrderByInput'
  | 'StaffUpdateInput'
  | 'StaffWhereInput'
  | 'StringFilter'
  | 'TaskCreateInput'
  | 'TaskInput'
  | 'TaskTypeFilter'

export type NexusGenEnumNames =
  | 'AdminPrivilege'
  | 'JobState'
  | 'OrderByArg'
  | 'TaskType'

export type NexusGenInterfaceNames = never

export type NexusGenScalarNames =
  | 'Boolean'
  | 'DateTime'
  | 'Float'
  | 'ID'
  | 'Int'
  | 'String'

export type NexusGenUnionNames = never

export interface NexusGenTypes {
  context: ctx.Context
  inputTypes: NexusGenInputs
  rootTypes: NexusGenRootTypes
  argTypes: NexusGenArgTypes
  fieldTypes: NexusGenFieldTypes
  allTypes: NexusGenAllTypes
  inheritedFields: NexusGenInheritedFields
  objectNames: NexusGenObjectNames
  inputNames: NexusGenInputNames
  enumNames: NexusGenEnumNames
  interfaceNames: NexusGenInterfaceNames
  scalarNames: NexusGenScalarNames
  unionNames: NexusGenUnionNames
  allInputTypes:
    | NexusGenTypes['inputNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['scalarNames']
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames']
  allNamedTypes:
    | NexusGenTypes['allInputTypes']
    | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames']
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginSchemaConfig {}
}
