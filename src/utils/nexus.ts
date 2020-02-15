import path from 'path'
import { inputObjectType } from 'nexus'
import { ObjectDefinitionBlock, RootTypingImport } from 'nexus/dist/core'
import { Model } from 'objection'

/** Add basic `id`, `createdAt` and `updatedAt` */
export function addBaseModelFields(t: ObjectDefinitionBlock<any>) {
  t.id('id')
  t.date('createdAt')
  t.date('updatedAt')
}

export function enumFilter(name: string) {
  return inputObjectType({
    name: `${name}Filter`,
    definition(t) {
      const type = name as any
      t.field('equals', { type })
      t.field('not', { type })
      t.list.field('in', { type })
      t.list.field('notIn', { type })
    }
  })
}

/** Removes all non-nullable fields that are null (Mutates input) */
// I can't freaking get TS types to work for this function
export function filterInputNonNullable<T>(
  input: T,
  nonNullableFields: (keyof T)[]
): T {
  nonNullableFields.forEach(field => {
    if (input[field] == null) {
      delete input[field]
    }
  })

  return input
}

/**
 * Generate root typing for a model for a nexus object
 *
 * @example
 * objectType({
 *   name: 'SomeModel',
 *   rootTyping: modelTyping(SomeModel)
 * })
 */
export function modelTyping(
  model: typeof Model,
  fileName?: string
): RootTypingImport {
  return {
    path: path.join(__dirname, `../models/${fileName ?? model.name}`),
    name: model.name
  }
}
