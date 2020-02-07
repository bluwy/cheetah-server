import Objection = require('objection')

/**
 * Resolves a where input by appending `andWhere` with the parsed input.
 * I'm not sure how to do fluent chaining.
 *
 * @example
 * const query = Model.query()
 * resolveWhereInput(query)
 * const result = await query
 */
export function resolveWhereInput(
  builder: Objection.QueryBuilder<any>,
  input: Record<string, any>,
  alias?: string
) {
  builder.andWhere(resolveWhereInputFn(input, alias))
}

/**
 * Resolves an order by input by appending `orderBy` with the parse input.
 * I'm not sure how to do fluent chaining.
 *
 * @example
 * const query = Model.query()
 * resolveOrderByInput(query)
 * const result = await query
 */
export function resolveOrderByInput(
  builder: Objection.QueryBuilder<any>,
  input: Record<string, any>,
  alias?: string
) {
  Object.entries(input).forEach(([k, v]) => {
    const key = alias != null ? `${alias}.${k}` : k

    if (typeof v === 'object') {
      // A nested order
      builder.leftJoinRelated(k)
      resolveOrderByInput(builder, v, k)
    } else {
      builder.orderBy(key, v)
    }
  })
}

/** Resolves the where input by returning a function for usage in knex's where function */
// This function is extracted out from the first function above so it correctly parenthesizes
// the where clause by returning a function. Knex will convert `andWhere(*function*)` into
// encapsulated parentheses.
function resolveWhereInputFn(input: Record<string, any>, alias?: string) {
  return (builder: Objection.QueryBuilder<any>) => {
    Object.entries(input).forEach(([k, v]) => {
      const key = alias != null ? `${alias}.${k}` : k

      if (k === 'AND') {
        builder.andWhere(resolveWhereAndFn(v, alias))
      } else if (k === 'OR') {
        builder.andWhere(resolveWhereOrFn(v, alias))
      } else if (k === 'NOT') {
        builder.andWhere(resolveWhereNotFn(v, alias))
      } else if (isFilter(v)) {
        // Hacky way to check if the object is a filter
        builder.andWhere(resolveFilterFn(key, v))
      } else {
        // It's a relation
        builder.leftJoinRelated(k)
        builder.andWhere(resolveWhereInputFn(v, k))
      }
    })
  }
}

// Used by isFilter function below
const filterFields = [
  'equals',
  'not',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'startsWith',
  'endsWith'
]

/**
 * Check if input is a filter, e.g. StringFilter, IntFilter, etc...
 * but cannot determine exactly what kind of filter it is
 */
function isFilter(input: any) {
  return (
    typeof input === 'object' &&
    Object.keys(input).every(key => filterFields.includes(key))
  )
}

/**
 * Resolves a filter by interpreting each fields operation.
 * This is filter agnostic and should work for any kind of filter as
 * long as the filter fields follow the convention as the list above.
 * This function returns a function to be used by knex's where function.
 *
 * @example SomeModel.query().andWhere(resolveFilterFn('modelField', { equals: 'something' }))
 */
function resolveFilterFn(key: string, filter: Record<string, any>) {
  return (builder: Objection.QueryBuilder<any>) => {
    Object.entries(filter).forEach(([k, v]) => {
      // String interpolation in where methods are safe
      // https://github.com/knex/documentation/issues/73#issuecomment-572482153
      switch (k) {
        case 'equals':
          builder.andWhere(key, v)
          break
        case 'not':
          builder.andWhere(key, '!=', v)
          break
        case 'in':
          builder.andWhere(key, 'in', v)
          break
        case 'notIn':
          builder.andWhere(key, 'not in', v)
          break
        case 'lt':
          builder.andWhere(key, '<', v)
          break
        case 'lte':
          builder.andWhere(key, '<=', v)
          break
        case 'gt':
          builder.andWhere(key, '>', v)
          break
        case 'gte':
          builder.andWhere(key, '>=', v)
          break
        case 'contains':
          builder.andWhere(key, 'ilike', `%${v}%`)
          break
        case 'startsWith':
          builder.andWhere(key, 'ilike', `${v}%`)
          break
        case 'endsWith':
          builder.andWhere(key, 'ilike', `%${v}`)
          break
        default:
          throw new Error(
            `Unable to resolve filter '${k}' for input field '${key}'`
          )
      }
    })
  }
}

/** Resolves the `AND` field by `andWhere` and resolving each list item */
function resolveWhereAndFn(andInput: Record<string, any>[], alias?: string) {
  return (builder: Objection.QueryBuilder<any>) => {
    andInput.forEach(input => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      builder.andWhere(resolveWhereInputFn(input, alias))
    })
  }
}

/** Resolves the `OR` field by `orWhere` and resolving each list item */
function resolveWhereOrFn(andInput: Record<string, any>[], alias?: string) {
  return (builder: Objection.QueryBuilder<any>) => {
    andInput.forEach(input => {
      builder.orWhere(resolveWhereInputFn(input, alias))
    })
  }
}

/** Resolves the `NOT` field by `andWhereNot` and resolving each list item */
function resolveWhereNotFn(andInput: Record<string, any>[], alias?: string) {
  return (builder: Objection.QueryBuilder<any>) => {
    andInput.forEach(input => {
      builder.andWhereNot(resolveWhereInputFn(input, alias))
    })
  }
}
