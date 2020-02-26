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
  AdminJobUpdateInput: {
    // input type
    address?: string | null // String
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
    customerId?: string | null // ID
    preferTime?: Date | null // DateTime
    staffPrimaryId?: string | null // ID
    staffSecondaryId?: string | null // ID
    state?: NexusGenEnums['JobState'] | null // JobState
  }
  AdminOrderByInput: {
    // input type
    privilege?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    username?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  AdminPrivilegeFilter: {
    // input type
    equals?: NexusGenEnums['AdminPrivilege'] | null // AdminPrivilege
    in?: NexusGenEnums['AdminPrivilege'][] | null // [AdminPrivilege!]
    not?: NexusGenEnums['AdminPrivilege'] | null // AdminPrivilege
    notIn?: NexusGenEnums['AdminPrivilege'][] | null // [AdminPrivilege!]
  }
  AdminUpdateInput: {
    // input type
    username?: string | null // String
  }
  AdminWhereInput: {
    // input type
    AND?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    NOT?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    OR?: NexusGenInputs['AdminWhereInput'][] | null // [AdminWhereInput!]
    privilege?: NexusGenInputs['AdminPrivilegeFilter'] | null // AdminPrivilegeFilter
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
    name?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  CompanyWhereInput: {
    // input type
    alias?: NexusGenInputs['StringFilter'] | null // StringFilter
    AND?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
    name?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
    OR?: NexusGenInputs['CompanyWhereInput'][] | null // [CompanyWhereInput!]
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
    email?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    phoneNumber?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    staffPrimary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    staffSecondary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
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
    email?: NexusGenInputs['StringFilter'] | null // StringFilter
    name?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['CustomerWhereInput'][] | null // [CustomerWhereInput!]
    OR?: NexusGenInputs['CustomerWhereInput'][] | null // [CustomerWhereInput!]
    phoneNumber?: NexusGenInputs['StringFilter'] | null // StringFilter
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
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
    preferTime?: Date | null // DateTime
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
    tasks: NexusGenInputs['TaskCreateInput'][] // [TaskCreateInput!]!
  }
  JobOrderByInput: {
    // input type
    address?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    checkIn?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    checkOut?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    code?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    customer?: NexusGenInputs['CustomerOrderByInput'] | null // CustomerOrderByInput
    preferTime?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    staffPrimary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    staffSecondary?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
    state?: NexusGenEnums['OrderByArg'] | null // OrderByArg
  }
  JobStateFilter: {
    // input type
    equals?: NexusGenEnums['JobState'] | null // JobState
    in?: NexusGenEnums['JobState'][] | null // [JobState!]
    not?: NexusGenEnums['JobState'] | null // JobState
    notIn?: NexusGenEnums['JobState'][] | null // [JobState!]
  }
  JobWhereInput: {
    // input type
    address?: NexusGenInputs['StringFilter'] | null // StringFilter
    AND?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    checkIn?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    checkOut?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    code?: NexusGenInputs['StringFilter'] | null // StringFilter
    customer?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    NOT?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    OR?: NexusGenInputs['JobWhereInput'][] | null // [JobWhereInput!]
    preferTime?: NexusGenInputs['DateTimeFilter'] | null // DateTimeFilter
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    state?: NexusGenInputs['JobStateFilter'] | null // JobStateFilter
  }
  ReassignJobInput: {
    // input type
    address: string // String!
    preferTime?: Date | null // DateTime
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
    tasks: NexusGenInputs['TaskCreateInput'][] // [TaskCreateInput!]!
  }
  StaffCreateInput: {
    // input type
    fullName: string // String!
    username: string // String!
  }
  StaffJobUpdateInput: {
    // input type
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
    state?: NexusGenEnums['JobState'] | null // JobState
  }
  StaffOrderByInput: {
    // input type
    active?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    fullName?: NexusGenEnums['OrderByArg'] | null // OrderByArg
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
    fullName?: NexusGenInputs['StringFilter'] | null // StringFilter
    NOT?: NexusGenInputs['StaffWhereInput'][] | null // [StaffWhereInput!]
    OR?: NexusGenInputs['StaffWhereInput'][] | null // [StaffWhereInput!]
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
  Mutation: {}
  Query: {}
  ReassignJobResponse: {
    // root type
    newJob: NexusGenRootTypes['Job'] // Job!
    oriJob: NexusGenRootTypes['Job'] // Job!
  }
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
  AdminJobUpdateInput: NexusGenInputs['AdminJobUpdateInput']
  AdminOrderByInput: NexusGenInputs['AdminOrderByInput']
  AdminPrivilegeFilter: NexusGenInputs['AdminPrivilegeFilter']
  AdminUpdateInput: NexusGenInputs['AdminUpdateInput']
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
  JobStateFilter: NexusGenInputs['JobStateFilter']
  JobWhereInput: NexusGenInputs['JobWhereInput']
  ReassignJobInput: NexusGenInputs['ReassignJobInput']
  StaffCreateInput: NexusGenInputs['StaffCreateInput']
  StaffJobUpdateInput: NexusGenInputs['StaffJobUpdateInput']
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
    staffSecondary: NexusGenRootTypes['Staff'] // Staff!
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
    preferTime: Date | null // DateTime
    staffPrimary: NexusGenRootTypes['Staff'] // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] // Staff!
    state: NexusGenEnums['JobState'] | null // JobState
    tasks: NexusGenRootTypes['Task'][] // [Task!]!
    updatedAt: Date // DateTime!
  }
  Mutation: {
    // field return type
    adminUpdateJob: NexusGenRootTypes['Job'] // Job!
    createAdmin: NexusGenRootTypes['Admin'] // Admin!
    createCompany: NexusGenRootTypes['Company'] // Company!
    createCustomer: NexusGenRootTypes['Customer'] // Customer!
    createJob: NexusGenRootTypes['Job'] // Job!
    createStaff: NexusGenRootTypes['Staff'] // Staff!
    deleteAdmin: boolean // Boolean!
    deleteCompany: boolean // Boolean!
    deleteCustomer: boolean // Boolean!
    deleteJob: boolean // Boolean!
    deleteStaff: boolean // Boolean!
    linkStaffDeviceId: boolean // Boolean!
    loginAdmin: boolean // Boolean!
    loginStaff: boolean // Boolean!
    logoutAdmin: boolean // Boolean!
    logoutStaff: boolean // Boolean!
    reassignJob: NexusGenRootTypes['ReassignJobResponse'] // ReassignJobResponse!
    resetAdminPassword: boolean // Boolean!
    resetStaffDeviceId: boolean // Boolean!
    sendAdminResetPasswordEmail: boolean // Boolean!
    setActions: boolean // Boolean!
    setTasks: boolean // Boolean!
    setTasksDone: boolean // Boolean!
    staffUpdateJob: NexusGenRootTypes['Job'] // Job!
    updateAdmin: NexusGenRootTypes['Admin'] // Admin!
    updateAdminPassword: boolean // Boolean!
    updateCustomer: NexusGenRootTypes['Customer'] // Customer!
    updateStaff: NexusGenRootTypes['Staff'] // Staff!
  }
  Query: {
    // field return type
    admin: NexusGenRootTypes['Admin'] // Admin!
    admins: NexusGenRootTypes['Admin'][] // [Admin!]!
    companies: NexusGenRootTypes['Company'][] // [Company!]!
    company: NexusGenRootTypes['Company'] // Company!
    customer: NexusGenRootTypes['Customer'] // Customer!
    customerCount: number // Int!
    customers: NexusGenRootTypes['Customer'][] // [Customer!]!
    job: NexusGenRootTypes['Job'] // Job!
    jobCount: number // Int!
    jobs: NexusGenRootTypes['Job'][] // [Job!]!
    staff: NexusGenRootTypes['Staff'] // Staff!
    staffs: NexusGenRootTypes['Staff'][] // [Staff!]!
  }
  ReassignJobResponse: {
    // field return type
    newJob: NexusGenRootTypes['Job'] // Job!
    oriJob: NexusGenRootTypes['Job'] // Job!
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
    adminUpdateJob: {
      // args
      data: NexusGenInputs['AdminJobUpdateInput'] // AdminJobUpdateInput!
      id: string // ID!
    }
    createAdmin: {
      // args
      data: NexusGenInputs['AdminCreateInput'] // AdminCreateInput!
    }
    createCompany: {
      // args
      data: NexusGenInputs['CompanyCreateInput'] // CompanyCreateInput!
    }
    createCustomer: {
      // args
      data: NexusGenInputs['CustomerCreateInput'] // CustomerCreateInput!
    }
    createJob: {
      // args
      data: NexusGenInputs['JobCreateInput'] // JobCreateInput!
    }
    createStaff: {
      // args
      data: NexusGenInputs['StaffCreateInput'] // StaffCreateInput!
    }
    deleteAdmin: {
      // args
      id?: string | null // ID
    }
    deleteCompany: {
      // args
      id: string // ID!
    }
    deleteCustomer: {
      // args
      id: string // ID!
    }
    deleteJob: {
      // args
      id: string // ID!
    }
    deleteStaff: {
      // args
      id?: string | null // ID
    }
    linkStaffDeviceId: {
      // args
      deviceId: string // String!
      username: string // String!
    }
    loginAdmin: {
      // args
      password: string // String!
      username: string // String!
    }
    loginStaff: {
      // args
      deviceId: string // String!
    }
    reassignJob: {
      // args
      data: NexusGenInputs['ReassignJobInput'] // ReassignJobInput!
      jobCode: string // String!
    }
    resetAdminPassword: {
      // args
      newPassword: string // String!
      resetToken: string // String!
    }
    resetStaffDeviceId: {
      // args
      id: string // ID!
    }
    sendAdminResetPasswordEmail: {
      // args
      username: string // String!
    }
    setActions: {
      // args
      data: NexusGenInputs['ActionInput'][] // [ActionInput!]!
      jobId: string // ID!
    }
    setTasks: {
      // args
      data: NexusGenInputs['TaskInput'][] // [TaskInput!]!
      jobId: string // ID!
    }
    setTasksDone: {
      // args
      ids: string[] // [ID!]!
    }
    staffUpdateJob: {
      // args
      data: NexusGenInputs['StaffJobUpdateInput'] // StaffJobUpdateInput!
      id: string // ID!
    }
    updateAdmin: {
      // args
      data: NexusGenInputs['AdminUpdateInput'] // AdminUpdateInput!
      id?: string | null // ID
    }
    updateAdminPassword: {
      // args
      id?: string | null // ID
      newPassword: string // String!
      oldPassword: string // String!
    }
    updateCustomer: {
      // args
      data: NexusGenInputs['CustomerUpdateInput'] // CustomerUpdateInput!
      id: string // ID!
    }
    updateStaff: {
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
    admins: {
      // args
      orderBy?: NexusGenInputs['AdminOrderByInput'] | null // AdminOrderByInput
      where?: NexusGenInputs['AdminWhereInput'] | null // AdminWhereInput
    }
    companies: {
      // args
      orderBy?: NexusGenInputs['CompanyOrderByInput'] | null // CompanyOrderByInput
      where?: NexusGenInputs['CompanyWhereInput'] | null // CompanyWhereInput
    }
    company: {
      // args
      id: string // ID!
    }
    customer: {
      // args
      id: string // ID!
    }
    customerCount: {
      // args
      where?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    }
    customers: {
      // args
      first?: number | null // Int
      orderBy?: NexusGenInputs['CustomerOrderByInput'] | null // CustomerOrderByInput
      skip?: number | null // Int
      where?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
    }
    job: {
      // args
      id: string // ID!
    }
    jobCount: {
      // args
      where?: NexusGenInputs['JobWhereInput'] | null // JobWhereInput
    }
    jobs: {
      // args
      first?: number | null // Int
      orderBy?: NexusGenInputs['JobOrderByInput'] | null // JobOrderByInput
      skip?: number | null // Int
      where?: NexusGenInputs['JobWhereInput'] | null // JobWhereInput
    }
    staff: {
      // args
      id?: string | null // ID
    }
    staffs: {
      // args
      orderBy?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
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
  | 'Mutation'
  | 'Query'
  | 'ReassignJobResponse'
  | 'Staff'
  | 'Task'

export type NexusGenInputNames =
  | 'ActionInput'
  | 'AdminCreateInput'
  | 'AdminJobUpdateInput'
  | 'AdminOrderByInput'
  | 'AdminPrivilegeFilter'
  | 'AdminUpdateInput'
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
  | 'JobStateFilter'
  | 'JobWhereInput'
  | 'ReassignJobInput'
  | 'StaffCreateInput'
  | 'StaffJobUpdateInput'
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
