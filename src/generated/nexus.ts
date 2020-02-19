/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from '../context'
import { Admin, AdminPrivilege } from '../models/Admin'
import { Customer } from '../models/Customer'
import { Job } from '../models/Job'
import { Assignment } from '../models/Assignment'
import { Task, TaskType } from '../models/Task'
import { Action } from '../models/Action'
import { Staff } from '../models/Staff'
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
  AdminAssignmentUpdateInput: {
    // input type
    address?: string | null // String
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
    preferTime?: Date | null // DateTime
    staffPrimaryId?: string | null // ID
    staffSecondaryId?: string | null // ID
  }
  AdminCreateInput: {
    // input type
    password: string // String!
    privilege: NexusGenEnums['AdminPrivilege'] // AdminPrivilege!
    username: string // String!
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
  AssignmentCreateInput: {
    // input type
    address: string // String!
    preferTime?: Date | null // DateTime
    staffPrimaryId: string // ID!
    staffSecondaryId?: string | null // ID
    tasks: NexusGenInputs['TaskCreateInput'][] // [TaskCreateInput!]!
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
    active: boolean // Boolean!
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
    code?: NexusGenEnums['OrderByArg'] | null // OrderByArg
    customer?: NexusGenInputs['CustomerOrderByInput'] | null // CustomerOrderByInput
  }
  JobUpdateInput: {
    // input type
    customerId?: string | null // ID
  }
  JobWhereInput: {
    // input type
    code?: NexusGenInputs['StringFilter'] | null // StringFilter
    customer?: NexusGenInputs['CustomerWhereInput'] | null // CustomerWhereInput
  }
  StaffAssignmentUpdateInput: {
    // input type
    checkIn?: Date | null // DateTime
    checkOut?: Date | null // DateTime
  }
  StaffCreateInput: {
    // input type
    fullName: string // String!
    username: string // String!
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
    username?: string | null // String
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
  OrderByArg: 'ASC' | 'DESC'
  TaskType: TaskType
}

export interface NexusGenRootTypes {
  Action: Action
  Admin: Admin
  Assignment: Assignment
  Company: {
    // root type
    alias: string // String!
    createdAt: Date // DateTime!
    id: string // ID!
    name: string // String!
    updatedAt: Date // DateTime!
  }
  Customer: Customer
  Job: Job
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
  AdminAssignmentUpdateInput: NexusGenInputs['AdminAssignmentUpdateInput']
  AdminCreateInput: NexusGenInputs['AdminCreateInput']
  AdminOrderByInput: NexusGenInputs['AdminOrderByInput']
  AdminPrivilegeFilter: NexusGenInputs['AdminPrivilegeFilter']
  AdminUpdateInput: NexusGenInputs['AdminUpdateInput']
  AdminWhereInput: NexusGenInputs['AdminWhereInput']
  AssignmentCreateInput: NexusGenInputs['AssignmentCreateInput']
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
  JobUpdateInput: NexusGenInputs['JobUpdateInput']
  JobWhereInput: NexusGenInputs['JobWhereInput']
  StaffAssignmentUpdateInput: NexusGenInputs['StaffAssignmentUpdateInput']
  StaffCreateInput: NexusGenInputs['StaffCreateInput']
  StaffOrderByInput: NexusGenInputs['StaffOrderByInput']
  StaffUpdateInput: NexusGenInputs['StaffUpdateInput']
  StaffWhereInput: NexusGenInputs['StaffWhereInput']
  StringFilter: NexusGenInputs['StringFilter']
  TaskCreateInput: NexusGenInputs['TaskCreateInput']
  TaskInput: NexusGenInputs['TaskInput']
  TaskTypeFilter: NexusGenInputs['TaskTypeFilter']
  AdminPrivilege: NexusGenEnums['AdminPrivilege']
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
  Assignment: {
    // field return type
    actions: NexusGenRootTypes['Action'][] // [Action!]!
    address: string // String!
    checkIn: Date | null // DateTime
    checkOut: Date | null // DateTime
    createdAt: Date // DateTime!
    expired: boolean // Boolean!
    id: string // ID!
    preferTime: Date | null // DateTime
    staffPrimary: NexusGenRootTypes['Staff'] // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] // Staff!
    tasks: NexusGenRootTypes['Task'][] // [Task!]!
    updatedAt: Date // DateTime!
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
    email: string | null // String
    name: string // String!
    phoneNumber: string | null // String
    staffPrimary: NexusGenRootTypes['Staff'] // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] // Staff!
  }
  Job: {
    // field return type
    assignments: NexusGenRootTypes['Assignment'][] // [Assignment!]!
    code: string // String!
    createdAt: Date // DateTime!
    customer: NexusGenRootTypes['Customer'] // Customer!
    id: string // ID!
    updatedAt: Date // DateTime!
  }
  Mutation: {
    // field return type
    adminUpdateAssignment: NexusGenRootTypes['Assignment'] // Assignment!
    createAdmin: NexusGenRootTypes['Admin'] // Admin!
    createAssignment: NexusGenRootTypes['Assignment'] // Assignment!
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
    resetAdminPassword: boolean // Boolean!
    resetStaffDeviceId: boolean // Boolean!
    sendAdminResetPasswordEmail: boolean // Boolean!
    setActions: boolean // Boolean!
    setTasks: boolean // Boolean!
    setTasksDone: boolean // Boolean!
    updateAdmin: NexusGenRootTypes['Admin'] // Admin!
    updateAdminPassword: boolean // Boolean!
    updateCustomer: NexusGenRootTypes['Customer'] // Customer!
    updateJob: NexusGenRootTypes['Job'] // Job!
    updateStaff: NexusGenRootTypes['Staff'] // Staff!
  }
  Query: {
    // field return type
    admin: NexusGenRootTypes['Admin'] // Admin!
    admins: NexusGenRootTypes['Admin'][] // [Admin!]!
    companies: NexusGenRootTypes['Company'][] // [Company!]!
    company: NexusGenRootTypes['Company'] // Company!
    customer: NexusGenRootTypes['Customer'] // Customer!
    customers: NexusGenRootTypes['Customer'][] // [Customer!]!
    job: NexusGenRootTypes['Job'] // Job!
    jobs: NexusGenRootTypes['Job'][] // [Job!]!
    staff: NexusGenRootTypes['Staff'] // Staff!
    staffs: NexusGenRootTypes['Staff'][] // [Staff!]!
  }
  Staff: {
    // field return type
    active: boolean // Boolean!
    createdAt: Date // DateTime!
    fullName: string // String!
    id: string // ID!
    linked: boolean // Boolean!
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
    adminUpdateAssignment: {
      // args
      data: NexusGenInputs['AdminAssignmentUpdateInput'] // AdminAssignmentUpdateInput!
      id: string // ID!
    }
    createAdmin: {
      // args
      data: NexusGenInputs['AdminCreateInput'] // AdminCreateInput!
    }
    createAssignment: {
      // args
      data: NexusGenInputs['AssignmentCreateInput'] // AssignmentCreateInput!
      jobId: string // ID!
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
      assignmentId: string // ID!
      data: NexusGenInputs['ActionInput'][] // [ActionInput!]!
    }
    setTasks: {
      // args
      assignmentId: string // ID!
      data: NexusGenInputs['TaskInput'][] // [TaskInput!]!
    }
    setTasksDone: {
      // args
      ids: string[] // [ID!]!
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
    updateJob: {
      // args
      data: NexusGenInputs['JobUpdateInput'] // JobUpdateInput!
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
      first?: number | null // Int
      orderBy?: NexusGenInputs['AdminOrderByInput'] | null // AdminOrderByInput
      skip?: number | null // Int
      where?: NexusGenInputs['AdminWhereInput'] | null // AdminWhereInput
    }
    companies: {
      // args
      first?: number | null // Int
      orderBy?: NexusGenInputs['CompanyOrderByInput'] | null // CompanyOrderByInput
      skip?: number | null // Int
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
      first?: number | null // Int
      orderBy?: NexusGenInputs['StaffOrderByInput'] | null // StaffOrderByInput
      skip?: number | null // Int
      where?: NexusGenInputs['StaffWhereInput'] | null // StaffWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | 'Action'
  | 'Admin'
  | 'Assignment'
  | 'Company'
  | 'Customer'
  | 'Job'
  | 'Mutation'
  | 'Query'
  | 'Staff'
  | 'Task'

export type NexusGenInputNames =
  | 'ActionInput'
  | 'AdminAssignmentUpdateInput'
  | 'AdminCreateInput'
  | 'AdminOrderByInput'
  | 'AdminPrivilegeFilter'
  | 'AdminUpdateInput'
  | 'AdminWhereInput'
  | 'AssignmentCreateInput'
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
  | 'JobUpdateInput'
  | 'JobWhereInput'
  | 'StaffAssignmentUpdateInput'
  | 'StaffCreateInput'
  | 'StaffOrderByInput'
  | 'StaffUpdateInput'
  | 'StaffWhereInput'
  | 'StringFilter'
  | 'TaskCreateInput'
  | 'TaskInput'
  | 'TaskTypeFilter'

export type NexusGenEnumNames = 'AdminPrivilege' | 'OrderByArg' | 'TaskType'

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
  > {}
  interface NexusGenPluginSchemaConfig {}
}
