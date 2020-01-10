/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from "../context"



declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ActionCreateInput: { // input type
    remarks: string; // String!
  }
  ActionFilter: { // input type
    every?: NexusGenInputs['ActionWhereInput'] | null; // ActionWhereInput
    none?: NexusGenInputs['ActionWhereInput'] | null; // ActionWhereInput
    some?: NexusGenInputs['ActionWhereInput'] | null; // ActionWhereInput
  }
  ActionUpdateInput: { // input type
    remarks?: string | null; // String
  }
  ActionWhereInput: { // input type
    AND?: NexusGenInputs['ActionWhereInput'][] | null; // [ActionWhereInput!]
    assignment?: NexusGenInputs['AssignmentWhereInput'] | null; // AssignmentWhereInput
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['ActionWhereInput'][] | null; // [ActionWhereInput!]
    OR?: NexusGenInputs['ActionWhereInput'][] | null; // [ActionWhereInput!]
    remarks?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  ActionWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  AdminCreateInput: { // input type
    password: string; // String!
    privilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
    username: string; // String!
  }
  AdminOrderByInput: { // input type
    hash?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    privilege?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    username?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  AdminUpdateInput: { // input type
    username?: string | null; // String
  }
  AdminWhereInput: { // input type
    AND?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    hash?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    OR?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    privilege?: NexusGenEnums['AdminPrivilege'] | null; // AdminPrivilege
    username?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  AdminWhereUniqueInput: { // input type
    id?: string | null; // ID
    username?: string | null; // String
  }
  AssignmentCreateInput: { // input type
    address: string; // String!
    preferTime?: any | null; // DateTime
    staffPrimary: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    staffSecondary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    tasks: NexusGenInputs['TaskCreateInput'][]; // [TaskCreateInput!]!
  }
  AssignmentFilter: { // input type
    every?: NexusGenInputs['AssignmentWhereInput'] | null; // AssignmentWhereInput
    none?: NexusGenInputs['AssignmentWhereInput'] | null; // AssignmentWhereInput
    some?: NexusGenInputs['AssignmentWhereInput'] | null; // AssignmentWhereInput
  }
  AssignmentUpdateInput: { // input type
    address?: string | null; // String
    checkIn?: any | null; // DateTime
    checkOut?: any | null; // DateTime
    preferTime?: any | null; // DateTime
    staffPrimary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    staffSecondary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
  }
  AssignmentWhereInput: { // input type
    actions?: NexusGenInputs['ActionFilter'] | null; // ActionFilter
    address?: NexusGenInputs['StringFilter'] | null; // StringFilter
    AND?: NexusGenInputs['AssignmentWhereInput'][] | null; // [AssignmentWhereInput!]
    checkIn?: NexusGenInputs['NullableDateTimeFilter'] | null; // NullableDateTimeFilter
    checkOut?: NexusGenInputs['NullableDateTimeFilter'] | null; // NullableDateTimeFilter
    expired?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    job?: NexusGenInputs['JobWhereInput'] | null; // JobWhereInput
    NOT?: NexusGenInputs['AssignmentWhereInput'][] | null; // [AssignmentWhereInput!]
    OR?: NexusGenInputs['AssignmentWhereInput'][] | null; // [AssignmentWhereInput!]
    preferTime?: NexusGenInputs['NullableDateTimeFilter'] | null; // NullableDateTimeFilter
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null; // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null; // StaffWhereInput
    tasks?: NexusGenInputs['TaskFilter'] | null; // TaskFilter
  }
  AssignmentWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  BooleanFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: boolean | null; // Boolean
  }
  CompanyCreateInput: { // input type
    alias: string; // String!
    name: string; // String!
  }
  CompanyOrderByInput: { // input type
    alias?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  CompanyUpdateInput: { // input type
    alias?: string | null; // String
    name?: string | null; // String
  }
  CompanyWhereInput: { // input type
    alias?: NexusGenInputs['StringFilter'] | null; // StringFilter
    AND?: NexusGenInputs['CompanyWhereInput'][] | null; // [CompanyWhereInput!]
    customers?: NexusGenInputs['CustomerFilter'] | null; // CustomerFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['CompanyWhereInput'][] | null; // [CompanyWhereInput!]
    OR?: NexusGenInputs['CompanyWhereInput'][] | null; // [CompanyWhereInput!]
  }
  CompanyWhereUniqueInput: { // input type
    alias?: string | null; // String
    id?: string | null; // ID
    name?: string | null; // String
  }
  CustomerCreateInput: { // input type
    active?: boolean | null; // Boolean
    addresses?: string[] | null; // [String!]
    code: string; // String!
    companyBelong: NexusGenInputs['CompanyWhereUniqueInput']; // CompanyWhereUniqueInput!
    email?: string | null; // String
    name: string; // String!
    phoneNumber?: string | null; // String
    staffPrimary: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    staffSecondary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    temporary?: boolean | null; // Boolean
  }
  CustomerFilter: { // input type
    every?: NexusGenInputs['CustomerWhereInput'] | null; // CustomerWhereInput
    none?: NexusGenInputs['CustomerWhereInput'] | null; // CustomerWhereInput
    some?: NexusGenInputs['CustomerWhereInput'] | null; // CustomerWhereInput
  }
  CustomerOrderByInput: { // input type
    active?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    code?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    email?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    phoneNumber?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    temporary?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  CustomerUpdateInput: { // input type
    active?: boolean | null; // Boolean
    addresses?: string[] | null; // [String!]
    code?: string | null; // String
    companyBelong?: NexusGenInputs['CompanyWhereUniqueInput'] | null; // CompanyWhereUniqueInput
    email?: string | null; // String
    name?: string | null; // String
    phoneNumber?: string | null; // String
    staffPrimary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    staffSecondary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    temporary?: boolean | null; // Boolean
  }
  CustomerWhereInput: { // input type
    active?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    AND?: NexusGenInputs['CustomerWhereInput'][] | null; // [CustomerWhereInput!]
    code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    companyBelong?: NexusGenInputs['CompanyWhereInput'] | null; // CompanyWhereInput
    email?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    jobs?: NexusGenInputs['JobFilter'] | null; // JobFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['CustomerWhereInput'][] | null; // [CustomerWhereInput!]
    OR?: NexusGenInputs['CustomerWhereInput'][] | null; // [CustomerWhereInput!]
    phoneNumber?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    staffPrimary?: NexusGenInputs['StaffWhereInput'] | null; // StaffWhereInput
    staffSecondary?: NexusGenInputs['StaffWhereInput'] | null; // StaffWhereInput
    temporary?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
  }
  CustomerWhereUniqueInput: { // input type
    code?: string | null; // String
    id?: string | null; // ID
    name?: string | null; // String
  }
  DateTimeFilter: { // input type
    equals?: any | null; // DateTime
    gt?: any | null; // DateTime
    gte?: any | null; // DateTime
    in?: any[] | null; // [DateTime!]
    lt?: any | null; // DateTime
    lte?: any | null; // DateTime
    not?: any | null; // DateTime
    notIn?: any[] | null; // [DateTime!]
  }
  JobCreateInput: { // input type
    address: string; // String!
    customer: NexusGenInputs['CustomerWhereUniqueInput']; // CustomerWhereUniqueInput!
    preferTime?: any | null; // DateTime
    staffPrimary: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    staffSecondary?: NexusGenInputs['StaffWhereUniqueInput'] | null; // StaffWhereUniqueInput
    tasks: NexusGenInputs['TaskCreateInput'][]; // [TaskCreateInput!]!
  }
  JobFilter: { // input type
    every?: NexusGenInputs['JobWhereInput'] | null; // JobWhereInput
    none?: NexusGenInputs['JobWhereInput'] | null; // JobWhereInput
    some?: NexusGenInputs['JobWhereInput'] | null; // JobWhereInput
  }
  JobOrderByInput: { // input type
    code?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    dateIssued?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    needsFollowUp?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  JobUpdateInput: { // input type
    customer?: NexusGenInputs['CustomerWhereUniqueInput'] | null; // CustomerWhereUniqueInput
    needsFollowUp?: boolean | null; // Boolean
  }
  JobWhereInput: { // input type
    AND?: NexusGenInputs['JobWhereInput'][] | null; // [JobWhereInput!]
    assignments?: NexusGenInputs['AssignmentFilter'] | null; // AssignmentFilter
    code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    customer?: NexusGenInputs['CustomerWhereInput'] | null; // CustomerWhereInput
    dateIssued?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    needsFollowUp?: NexusGenInputs['NullableBooleanFilter'] | null; // NullableBooleanFilter
    NOT?: NexusGenInputs['JobWhereInput'][] | null; // [JobWhereInput!]
    OR?: NexusGenInputs['JobWhereInput'][] | null; // [JobWhereInput!]
  }
  JobWhereUniqueInput: { // input type
    code?: string | null; // String
    id?: string | null; // ID
  }
  NullableBooleanFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: boolean | null; // Boolean
  }
  NullableDateTimeFilter: { // input type
    equals?: any | null; // DateTime
    gt?: any | null; // DateTime
    gte?: any | null; // DateTime
    in?: any[] | null; // [DateTime!]
    lt?: any | null; // DateTime
    lte?: any | null; // DateTime
    not?: any | null; // DateTime
    notIn?: any[] | null; // [DateTime!]
  }
  NullableStringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  StaffCreateInput: { // input type
    fullName: string; // String!
    password: string; // String!
    username: string; // String!
  }
  StaffOrderByInput: { // input type
    active?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    fullName?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    hash?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    passwordForgotten?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    username?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  StaffUpdateInput: { // input type
    active?: boolean | null; // Boolean
    fullName?: string | null; // String
    username?: string | null; // String
  }
  StaffWhereInput: { // input type
    active?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    AND?: NexusGenInputs['StaffWhereInput'][] | null; // [StaffWhereInput!]
    assignmentPrimaries?: NexusGenInputs['CustomerFilter'] | null; // CustomerFilter
    assignmentSecondaries?: NexusGenInputs['CustomerFilter'] | null; // CustomerFilter
    customerPrimaries?: NexusGenInputs['AssignmentFilter'] | null; // AssignmentFilter
    customerSecondaries?: NexusGenInputs['AssignmentFilter'] | null; // AssignmentFilter
    fullName?: NexusGenInputs['StringFilter'] | null; // StringFilter
    hash?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['StaffWhereInput'][] | null; // [StaffWhereInput!]
    OR?: NexusGenInputs['StaffWhereInput'][] | null; // [StaffWhereInput!]
    passwordForgotten?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    username?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  StaffWhereUniqueInput: { // input type
    id?: string | null; // ID
    username?: string | null; // String
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  TaskCreateInput: { // input type
    remarks: string; // String!
    type: NexusGenEnums['TaskType']; // TaskType!
  }
  TaskFilter: { // input type
    every?: NexusGenInputs['TaskWhereInput'] | null; // TaskWhereInput
    none?: NexusGenInputs['TaskWhereInput'] | null; // TaskWhereInput
    some?: NexusGenInputs['TaskWhereInput'] | null; // TaskWhereInput
  }
  TaskUpdateInput: { // input type
    done?: boolean | null; // Boolean
    remarks?: string | null; // String
    type?: NexusGenEnums['TaskType'] | null; // TaskType
  }
  TaskWhereInput: { // input type
    AND?: NexusGenInputs['TaskWhereInput'][] | null; // [TaskWhereInput!]
    assignment?: NexusGenInputs['AssignmentWhereInput'] | null; // AssignmentWhereInput
    done?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['TaskWhereInput'][] | null; // [TaskWhereInput!]
    OR?: NexusGenInputs['TaskWhereInput'][] | null; // [TaskWhereInput!]
    remarks?: NexusGenInputs['StringFilter'] | null; // StringFilter
    type?: NexusGenEnums['TaskType'] | null; // TaskType
  }
  TaskWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
}

export interface NexusGenEnums {
  AdminPrivilege: "BASIC" | "FULL"
  OrderByArg: "asc" | "desc"
  TaskType: "COMPLAINT" | "DELIVERY" | "OTHERS" | "SERVICE" | "TRANSPORT"
}

export interface NexusGenRootTypes {
  Action: { // root type
    id: string; // ID!
    remarks: string; // String!
  }
  Admin: { // root type
    id: string; // ID!
    privilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
    username: string; // String!
  }
  AdminLoginResponse: { // root type
    adminId: string; // String!
    adminPrivilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
    token: string; // String!
  }
  AdminVerifyTokenResponse: { // root type
    adminId: string; // String!
    adminPrivilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
  }
  Assignment: { // root type
    address: string; // String!
    checkIn?: any | null; // DateTime
    checkOut?: any | null; // DateTime
    expired: boolean; // Boolean!
    id: string; // ID!
    preferTime?: any | null; // DateTime
  }
  Company: { // root type
    alias: string; // String!
    id: string; // ID!
    name: string; // String!
  }
  Customer: { // root type
    active: boolean; // Boolean!
    addresses: string[]; // [String!]!
    code: string; // String!
    email?: string | null; // String
    id: string; // ID!
    name: string; // String!
    phoneNumber?: string | null; // String
    temporary: boolean; // Boolean!
  }
  Job: { // root type
    code: string; // String!
    dateIssued: any; // DateTime!
    id: string; // ID!
    needsFollowUp?: boolean | null; // Boolean
  }
  Mutation: {};
  Query: {};
  Staff: { // root type
    active: boolean; // Boolean!
    fullName: string; // String!
    id: string; // ID!
    passwordForgotten: boolean; // Boolean!
    username: string; // String!
  }
  StaffLoginResponse: { // root type
    staffId: string; // String!
    token: string; // String!
  }
  StaffVerifyTokenResponse: { // root type
    staffId: string; // String!
  }
  Task: { // root type
    id: string; // ID!
    remarks: string; // String!
    type: NexusGenEnums['TaskType']; // TaskType!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  ActionCreateInput: NexusGenInputs['ActionCreateInput'];
  ActionFilter: NexusGenInputs['ActionFilter'];
  ActionUpdateInput: NexusGenInputs['ActionUpdateInput'];
  ActionWhereInput: NexusGenInputs['ActionWhereInput'];
  ActionWhereUniqueInput: NexusGenInputs['ActionWhereUniqueInput'];
  AdminCreateInput: NexusGenInputs['AdminCreateInput'];
  AdminOrderByInput: NexusGenInputs['AdminOrderByInput'];
  AdminUpdateInput: NexusGenInputs['AdminUpdateInput'];
  AdminWhereInput: NexusGenInputs['AdminWhereInput'];
  AdminWhereUniqueInput: NexusGenInputs['AdminWhereUniqueInput'];
  AssignmentCreateInput: NexusGenInputs['AssignmentCreateInput'];
  AssignmentFilter: NexusGenInputs['AssignmentFilter'];
  AssignmentUpdateInput: NexusGenInputs['AssignmentUpdateInput'];
  AssignmentWhereInput: NexusGenInputs['AssignmentWhereInput'];
  AssignmentWhereUniqueInput: NexusGenInputs['AssignmentWhereUniqueInput'];
  BooleanFilter: NexusGenInputs['BooleanFilter'];
  CompanyCreateInput: NexusGenInputs['CompanyCreateInput'];
  CompanyOrderByInput: NexusGenInputs['CompanyOrderByInput'];
  CompanyUpdateInput: NexusGenInputs['CompanyUpdateInput'];
  CompanyWhereInput: NexusGenInputs['CompanyWhereInput'];
  CompanyWhereUniqueInput: NexusGenInputs['CompanyWhereUniqueInput'];
  CustomerCreateInput: NexusGenInputs['CustomerCreateInput'];
  CustomerFilter: NexusGenInputs['CustomerFilter'];
  CustomerOrderByInput: NexusGenInputs['CustomerOrderByInput'];
  CustomerUpdateInput: NexusGenInputs['CustomerUpdateInput'];
  CustomerWhereInput: NexusGenInputs['CustomerWhereInput'];
  CustomerWhereUniqueInput: NexusGenInputs['CustomerWhereUniqueInput'];
  DateTimeFilter: NexusGenInputs['DateTimeFilter'];
  JobCreateInput: NexusGenInputs['JobCreateInput'];
  JobFilter: NexusGenInputs['JobFilter'];
  JobOrderByInput: NexusGenInputs['JobOrderByInput'];
  JobUpdateInput: NexusGenInputs['JobUpdateInput'];
  JobWhereInput: NexusGenInputs['JobWhereInput'];
  JobWhereUniqueInput: NexusGenInputs['JobWhereUniqueInput'];
  NullableBooleanFilter: NexusGenInputs['NullableBooleanFilter'];
  NullableDateTimeFilter: NexusGenInputs['NullableDateTimeFilter'];
  NullableStringFilter: NexusGenInputs['NullableStringFilter'];
  StaffCreateInput: NexusGenInputs['StaffCreateInput'];
  StaffOrderByInput: NexusGenInputs['StaffOrderByInput'];
  StaffUpdateInput: NexusGenInputs['StaffUpdateInput'];
  StaffWhereInput: NexusGenInputs['StaffWhereInput'];
  StaffWhereUniqueInput: NexusGenInputs['StaffWhereUniqueInput'];
  StringFilter: NexusGenInputs['StringFilter'];
  TaskCreateInput: NexusGenInputs['TaskCreateInput'];
  TaskFilter: NexusGenInputs['TaskFilter'];
  TaskUpdateInput: NexusGenInputs['TaskUpdateInput'];
  TaskWhereInput: NexusGenInputs['TaskWhereInput'];
  TaskWhereUniqueInput: NexusGenInputs['TaskWhereUniqueInput'];
  AdminPrivilege: NexusGenEnums['AdminPrivilege'];
  OrderByArg: NexusGenEnums['OrderByArg'];
  TaskType: NexusGenEnums['TaskType'];
}

export interface NexusGenFieldTypes {
  Action: { // field return type
    id: string; // ID!
    remarks: string; // String!
  }
  Admin: { // field return type
    id: string; // ID!
    privilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
    username: string; // String!
  }
  AdminLoginResponse: { // field return type
    adminId: string; // String!
    adminPrivilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
    token: string; // String!
  }
  AdminVerifyTokenResponse: { // field return type
    adminId: string; // String!
    adminPrivilege: NexusGenEnums['AdminPrivilege']; // AdminPrivilege!
  }
  Assignment: { // field return type
    actions: NexusGenRootTypes['Action'][]; // [Action!]!
    address: string; // String!
    checkIn: any | null; // DateTime
    checkOut: any | null; // DateTime
    expired: boolean; // Boolean!
    id: string; // ID!
    preferTime: any | null; // DateTime
    staffPrimary: NexusGenRootTypes['Staff']; // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] | null; // Staff
    tasks: NexusGenRootTypes['Task'][]; // [Task!]!
  }
  Company: { // field return type
    alias: string; // String!
    id: string; // ID!
    name: string; // String!
  }
  Customer: { // field return type
    active: boolean; // Boolean!
    addresses: string[]; // [String!]!
    code: string; // String!
    companyBelong: NexusGenRootTypes['Company']; // Company!
    email: string | null; // String
    id: string; // ID!
    name: string; // String!
    phoneNumber: string | null; // String
    staffPrimary: NexusGenRootTypes['Staff']; // Staff!
    staffSecondary: NexusGenRootTypes['Staff'] | null; // Staff
    temporary: boolean; // Boolean!
  }
  Job: { // field return type
    assignments: NexusGenRootTypes['Assignment'][]; // [Assignment!]!
    code: string; // String!
    customer: NexusGenRootTypes['Customer']; // Customer!
    dateIssued: any; // DateTime!
    id: string; // ID!
    needsFollowUp: boolean | null; // Boolean
  }
  Mutation: { // field return type
    createAction: NexusGenRootTypes['Action']; // Action!
    createAdmin: NexusGenRootTypes['Admin']; // Admin!
    createAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    createCompany: NexusGenRootTypes['Company']; // Company!
    createCustomer: NexusGenRootTypes['Customer']; // Customer!
    createJob: NexusGenRootTypes['Job']; // Job!
    createStaff: NexusGenRootTypes['Staff']; // Staff!
    createTask: NexusGenRootTypes['Task']; // Task!
    deleteAction: boolean; // Boolean!
    deleteAdmin: boolean; // Boolean!
    deleteCompany: boolean; // Boolean!
    deleteCustomer: boolean; // Boolean!
    deleteJob: boolean; // Boolean!
    deleteStaff: boolean; // Boolean!
    deleteTask: boolean; // Boolean!
    forgotAdminPassword: boolean; // Boolean!
    forgotStaffPassword: boolean; // Boolean!
    loginAdmin: NexusGenRootTypes['AdminLoginResponse']; // AdminLoginResponse!
    loginStaff: NexusGenRootTypes['StaffLoginResponse']; // StaffLoginResponse!
    resetAdminPassword: boolean; // Boolean!
    resetStaffPassword: boolean; // Boolean!
    updateAction: NexusGenRootTypes['Action'] | null; // Action
    updateAdmin: NexusGenRootTypes['Admin'] | null; // Admin
    updateAdminPassword: boolean; // Boolean!
    updateAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    updateCompany: NexusGenRootTypes['Company'] | null; // Company
    updateCustomer: NexusGenRootTypes['Customer']; // Customer!
    updateJob: NexusGenRootTypes['Job']; // Job!
    updateStaff: NexusGenRootTypes['Staff'] | null; // Staff
    updateTask: NexusGenRootTypes['Task']; // Task!
  }
  Query: { // field return type
    admin: NexusGenRootTypes['Admin'] | null; // Admin
    admins: NexusGenRootTypes['Admin'][]; // [Admin!]!
    companies: NexusGenRootTypes['Company'][]; // [Company!]!
    company: NexusGenRootTypes['Company'] | null; // Company
    customer: NexusGenRootTypes['Customer'] | null; // Customer
    customerCount: number; // Int!
    customers: NexusGenRootTypes['Customer'][]; // [Customer!]!
    job: NexusGenRootTypes['Job'] | null; // Job
    jobCount: number; // Int!
    jobs: NexusGenRootTypes['Job'][]; // [Job!]!
    staff: NexusGenRootTypes['Staff'] | null; // Staff
    staffs: NexusGenRootTypes['Staff'][]; // [Staff!]!
    verifyAdminToken: NexusGenRootTypes['AdminVerifyTokenResponse'] | null; // AdminVerifyTokenResponse
    verifyStaffToken: NexusGenRootTypes['StaffVerifyTokenResponse'] | null; // StaffVerifyTokenResponse
  }
  Staff: { // field return type
    active: boolean; // Boolean!
    fullName: string; // String!
    id: string; // ID!
    passwordForgotten: boolean; // Boolean!
    username: string; // String!
  }
  StaffLoginResponse: { // field return type
    staffId: string; // String!
    token: string; // String!
  }
  StaffVerifyTokenResponse: { // field return type
    staffId: string; // String!
  }
  Task: { // field return type
    id: string; // ID!
    remarks: string; // String!
    type: NexusGenEnums['TaskType']; // TaskType!
  }
}

export interface NexusGenArgTypes {
  Assignment: {
    actions: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    tasks: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Job: {
    assignments: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    createAction: { // args
      assignmentWhere: NexusGenInputs['AssignmentWhereUniqueInput']; // AssignmentWhereUniqueInput!
      data: NexusGenInputs['ActionCreateInput']; // ActionCreateInput!
    }
    createAdmin: { // args
      data: NexusGenInputs['AdminCreateInput']; // AdminCreateInput!
    }
    createAssignment: { // args
      data: NexusGenInputs['AssignmentCreateInput']; // AssignmentCreateInput!
      jobWhere: NexusGenInputs['JobWhereUniqueInput']; // JobWhereUniqueInput!
    }
    createCompany: { // args
      data: NexusGenInputs['CompanyCreateInput']; // CompanyCreateInput!
    }
    createCustomer: { // args
      data: NexusGenInputs['CustomerCreateInput']; // CustomerCreateInput!
    }
    createJob: { // args
      data: NexusGenInputs['JobCreateInput']; // JobCreateInput!
    }
    createStaff: { // args
      data: NexusGenInputs['StaffCreateInput']; // StaffCreateInput!
    }
    createTask: { // args
      assignmentWhere: NexusGenInputs['AssignmentWhereUniqueInput']; // AssignmentWhereUniqueInput!
      data: NexusGenInputs['TaskCreateInput']; // TaskCreateInput!
    }
    deleteAction: { // args
      where: NexusGenInputs['ActionWhereUniqueInput']; // ActionWhereUniqueInput!
    }
    deleteAdmin: { // args
      where: NexusGenInputs['AdminWhereUniqueInput']; // AdminWhereUniqueInput!
    }
    deleteCompany: { // args
      where: NexusGenInputs['CompanyWhereUniqueInput']; // CompanyWhereUniqueInput!
    }
    deleteCustomer: { // args
      where: NexusGenInputs['CustomerWhereUniqueInput']; // CustomerWhereUniqueInput!
    }
    deleteJob: { // args
      where: NexusGenInputs['JobWhereUniqueInput']; // JobWhereUniqueInput!
    }
    deleteStaff: { // args
      where: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    }
    deleteTask: { // args
      where: NexusGenInputs['TaskWhereUniqueInput']; // TaskWhereUniqueInput!
    }
    forgotAdminPassword: { // args
      username: string; // String!
    }
    forgotStaffPassword: { // args
      where: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    }
    loginAdmin: { // args
      password: string; // String!
      username: string; // String!
    }
    loginStaff: { // args
      password: string; // String!
      username: string; // String!
    }
    resetAdminPassword: { // args
      newPassword: string; // String!
      token: string; // String!
    }
    resetStaffPassword: { // args
      newPassword: string; // String!
      where: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    }
    updateAction: { // args
      data: NexusGenInputs['ActionUpdateInput']; // ActionUpdateInput!
      where: NexusGenInputs['ActionWhereUniqueInput']; // ActionWhereUniqueInput!
    }
    updateAdmin: { // args
      data: NexusGenInputs['AdminUpdateInput']; // AdminUpdateInput!
      where: NexusGenInputs['AdminWhereUniqueInput']; // AdminWhereUniqueInput!
    }
    updateAdminPassword: { // args
      newPassword: string; // String!
      oldPassword: string; // String!
      where: NexusGenInputs['AdminWhereUniqueInput']; // AdminWhereUniqueInput!
    }
    updateAssignment: { // args
      data: NexusGenInputs['AssignmentUpdateInput']; // AssignmentUpdateInput!
      where: NexusGenInputs['AssignmentWhereUniqueInput']; // AssignmentWhereUniqueInput!
    }
    updateCompany: { // args
      data: NexusGenInputs['CompanyUpdateInput']; // CompanyUpdateInput!
      where: NexusGenInputs['CompanyWhereUniqueInput']; // CompanyWhereUniqueInput!
    }
    updateCustomer: { // args
      data: NexusGenInputs['CustomerUpdateInput']; // CustomerUpdateInput!
      where: NexusGenInputs['CustomerWhereUniqueInput']; // CustomerWhereUniqueInput!
    }
    updateJob: { // args
      data: NexusGenInputs['JobUpdateInput']; // JobUpdateInput!
      where: NexusGenInputs['JobWhereUniqueInput']; // JobWhereUniqueInput!
    }
    updateStaff: { // args
      data: NexusGenInputs['StaffUpdateInput']; // StaffUpdateInput!
      where: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    }
    updateTask: { // args
      data: NexusGenInputs['TaskUpdateInput']; // TaskUpdateInput!
      where: NexusGenInputs['TaskWhereUniqueInput']; // TaskWhereUniqueInput!
    }
  }
  Query: {
    admin: { // args
      where: NexusGenInputs['AdminWhereUniqueInput']; // AdminWhereUniqueInput!
    }
    admins: { // args
      orderBy?: NexusGenInputs['AdminOrderByInput'] | null; // AdminOrderByInput
      where?: NexusGenInputs['AdminWhereInput'] | null; // AdminWhereInput
    }
    companies: { // args
      orderBy?: NexusGenInputs['CompanyOrderByInput'] | null; // CompanyOrderByInput
      where?: NexusGenInputs['CompanyWhereInput'] | null; // CompanyWhereInput
    }
    company: { // args
      where: NexusGenInputs['CompanyWhereUniqueInput']; // CompanyWhereUniqueInput!
    }
    customer: { // args
      where: NexusGenInputs['CustomerWhereUniqueInput']; // CustomerWhereUniqueInput!
    }
    customers: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['CustomerOrderByInput'] | null; // CustomerOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['CustomerWhereInput'] | null; // CustomerWhereInput
    }
    job: { // args
      where: NexusGenInputs['JobWhereUniqueInput']; // JobWhereUniqueInput!
    }
    jobs: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['JobOrderByInput'] | null; // JobOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['JobWhereInput'] | null; // JobWhereInput
    }
    staff: { // args
      where: NexusGenInputs['StaffWhereUniqueInput']; // StaffWhereUniqueInput!
    }
    staffs: { // args
      orderBy?: NexusGenInputs['StaffOrderByInput'] | null; // StaffOrderByInput
      where?: NexusGenInputs['StaffWhereInput'] | null; // StaffWhereInput
    }
    verifyAdminToken: { // args
      token: string; // String!
    }
    verifyStaffToken: { // args
      token: string; // String!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Action" | "Admin" | "AdminLoginResponse" | "AdminVerifyTokenResponse" | "Assignment" | "Company" | "Customer" | "Job" | "Mutation" | "Query" | "Staff" | "StaffLoginResponse" | "StaffVerifyTokenResponse" | "Task";

export type NexusGenInputNames = "ActionCreateInput" | "ActionFilter" | "ActionUpdateInput" | "ActionWhereInput" | "ActionWhereUniqueInput" | "AdminCreateInput" | "AdminOrderByInput" | "AdminUpdateInput" | "AdminWhereInput" | "AdminWhereUniqueInput" | "AssignmentCreateInput" | "AssignmentFilter" | "AssignmentUpdateInput" | "AssignmentWhereInput" | "AssignmentWhereUniqueInput" | "BooleanFilter" | "CompanyCreateInput" | "CompanyOrderByInput" | "CompanyUpdateInput" | "CompanyWhereInput" | "CompanyWhereUniqueInput" | "CustomerCreateInput" | "CustomerFilter" | "CustomerOrderByInput" | "CustomerUpdateInput" | "CustomerWhereInput" | "CustomerWhereUniqueInput" | "DateTimeFilter" | "JobCreateInput" | "JobFilter" | "JobOrderByInput" | "JobUpdateInput" | "JobWhereInput" | "JobWhereUniqueInput" | "NullableBooleanFilter" | "NullableDateTimeFilter" | "NullableStringFilter" | "StaffCreateInput" | "StaffOrderByInput" | "StaffUpdateInput" | "StaffWhereInput" | "StaffWhereUniqueInput" | "StringFilter" | "TaskCreateInput" | "TaskFilter" | "TaskUpdateInput" | "TaskWhereInput" | "TaskWhereUniqueInput";

export type NexusGenEnumNames = "AdminPrivilege" | "OrderByArg" | "TaskType";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: ctx.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}