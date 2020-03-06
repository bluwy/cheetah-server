import { inputObjectType, core } from 'nexus'

/** Add `id`, `createdAt` and `updatedAt` */
export function addBaseModelFields(t: core.ObjectDefinitionBlock<any>) {
  t.id('id')
  t.date('createdAt')
  t.date('updatedAt')
}

/** Add 'AND', 'OR', 'NOT', 'createdAt` and `updatedAt` */
export function addBaseModelWhereFields(t: core.InputDefinitionBlock<any>) {
  t.list.field('AND', { type: t.typeName as any })
  t.list.field('OR', { type: t.typeName as any })
  t.list.field('NOT', { type: t.typeName as any })
  t.field('createdAt', { type: 'DateTimeFilter' })
  t.field('updatedAt', { type: 'DateTimeFilter' })
}

/** Add 'createdAt` and `updatedAt` */
export function addBaseModelOrderByFields(t: core.InputDefinitionBlock<any>) {
  t.field('createdAt', { type: 'OrderByArg' })
  t.field('updatedAt', { type: 'OrderByArg' })
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

type ObjectTransform<T extends object, K = keyof T> = {
  from: K
  to: string
  value: (from: any) => any
}

export function transformObj<T extends object>(
  obj: T,
  transforms: ObjectTransform<T>[]
) {
  transforms.forEach(transform => {
    if (obj[transform.from]) {
      const fromValue = obj[transform.from]

      obj[transform.to as keyof T] =
        transform.value != null ? transform.value(fromValue) : fromValue

      delete obj[transform.from]
    }
  })

  return obj
}
