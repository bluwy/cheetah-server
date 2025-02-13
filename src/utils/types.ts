import { core } from '@nexus/schema'

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type NexusInput<T extends string> = core.GetGen2<'inputTypes', T>

/** Not 'null', undefined still preserved */
export type NonNullRecord<T> = { [P in keyof T]: Exclude<T[P], null> }

export type NonNullRecordBy<T, K extends keyof T> = Omit<T, K> &
  NonNullRecord<Pick<T, K>>

export type RequiredRecord<T> = Required<{ [P in keyof T]: NonNullable<T[P]> }>

export type RequiredRecordBy<T, K extends keyof T> = Omit<T, K> &
  RequiredRecord<Pick<T, K>>
