/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from '../context'
import { Admin } from '../models/Admin'
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
}

export interface NexusGenEnums {
  AdminPrivilege: 'BASIC' | 'FULL'
  OrderByArg: 'ASC' | 'DESC'
}

export interface NexusGenRootTypes {
  Admin: Admin
  Company: {
    // root type
    alias: string // String!
    createdAt: Date // DateTime!
    id: string // ID!
    name: string // String!
    updatedAt: Date // DateTime!
  }
  Mutation: {}
  Query: {}
  Staff: Staff
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AdminCreateInput: NexusGenInputs['AdminCreateInput']
  AdminOrderByInput: NexusGenInputs['AdminOrderByInput']
  AdminPrivilegeFilter: NexusGenInputs['AdminPrivilegeFilter']
  AdminUpdateInput: NexusGenInputs['AdminUpdateInput']
  AdminWhereInput: NexusGenInputs['AdminWhereInput']
  BooleanFilter: NexusGenInputs['BooleanFilter']
  CompanyCreateInput: NexusGenInputs['CompanyCreateInput']
  CompanyOrderByInput: NexusGenInputs['CompanyOrderByInput']
  CompanyWhereInput: NexusGenInputs['CompanyWhereInput']
  DateTimeFilter: NexusGenInputs['DateTimeFilter']
  FloatFilter: NexusGenInputs['FloatFilter']
  IntFilter: NexusGenInputs['IntFilter']
  StaffCreateInput: NexusGenInputs['StaffCreateInput']
  StaffOrderByInput: NexusGenInputs['StaffOrderByInput']
  StaffUpdateInput: NexusGenInputs['StaffUpdateInput']
  StaffWhereInput: NexusGenInputs['StaffWhereInput']
  StringFilter: NexusGenInputs['StringFilter']
  AdminPrivilege: NexusGenEnums['AdminPrivilege']
  OrderByArg: NexusGenEnums['OrderByArg']
}

export interface NexusGenFieldTypes {
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
  Mutation: {
    // field return type
    createAdmin: NexusGenRootTypes['Admin'] // Admin!
    createCompany: NexusGenRootTypes['Company'] // Company!
    createStaff: NexusGenRootTypes['Staff'] // Staff!
    deleteAdmin: boolean // Boolean!
    deleteCompany: boolean // Boolean!
    deleteStaff: boolean // Boolean!
    linkStaffDeviceId: boolean // Boolean!
    loginAdmin: boolean // Boolean!
    loginStaff: boolean // Boolean!
    logoutAdmin: boolean // Boolean!
    logoutStaff: boolean // Boolean!
    resetAdminPassword: boolean // Boolean!
    resetStaffDeviceId: boolean // Boolean!
    sendAdminResetPasswordEmail: boolean // Boolean!
    updateAdmin: NexusGenRootTypes['Admin'] // Admin!
    updateAdminPassword: boolean // Boolean!
    updateStaff: NexusGenRootTypes['Staff'] // Staff!
  }
  Query: {
    // field return type
    admin: NexusGenRootTypes['Admin'] // Admin!
    admins: NexusGenRootTypes['Admin'][] // [Admin!]!
    companies: NexusGenRootTypes['Company'][] // [Company!]!
    company: NexusGenRootTypes['Company'] // Company!
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
}

export interface NexusGenArgTypes {
  Mutation: {
    createAdmin: {
      // args
      data: NexusGenInputs['AdminCreateInput'] // AdminCreateInput!
    }
    createCompany: {
      // args
      data: NexusGenInputs['CompanyCreateInput'] // CompanyCreateInput!
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
  | 'Admin'
  | 'Company'
  | 'Mutation'
  | 'Query'
  | 'Staff'

export type NexusGenInputNames =
  | 'AdminCreateInput'
  | 'AdminOrderByInput'
  | 'AdminPrivilegeFilter'
  | 'AdminUpdateInput'
  | 'AdminWhereInput'
  | 'BooleanFilter'
  | 'CompanyCreateInput'
  | 'CompanyOrderByInput'
  | 'CompanyWhereInput'
  | 'DateTimeFilter'
  | 'FloatFilter'
  | 'IntFilter'
  | 'StaffCreateInput'
  | 'StaffOrderByInput'
  | 'StaffUpdateInput'
  | 'StaffWhereInput'
  | 'StringFilter'

export type NexusGenEnumNames = 'AdminPrivilege' | 'OrderByArg'

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
