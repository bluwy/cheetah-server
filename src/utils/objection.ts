import { merge } from 'lodash'
import Objection from 'objection'

/**
 * Resolves a where input by appending `andWhere` with the parsed input.
 * Use with knex `modify` to hook this resolver. The function will do
 * nothing if input is null to support fluent chaining
 *
 * @example
 * await Model.query().modify(resolveWhereInput, input)
 */
export function resolveWhereInput(
  qb: Objection.QueryBuilder<any>,
  input: Record<string, any>,
  alias?: string
) {
  if (input != null) {
    new WhereInputResolver(qb, input, alias).parse()
  }
}

/**
 * Resolves an order by input by appending `orderBy` with the parse input.
 * Use with knex `modify` to hook this resolver. The function will do
 * nothing if input is null to support fluent chaining
 *
 * @example
 * await Model.query().modify(resolveOrderByInput, input)
 */
export function resolveOrderByInput(
  qb: Objection.QueryBuilder<any>,
  input: Record<string, any>,
  alias?: string
) {
  if (input != null) {
    new OrderByInputResolver(qb, input, alias).parse()
  }
}

export class WhereInputResolver {
  // Used by isFilter function below
  private readonly filterFields = [
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

  constructor(
    private rootQb: Objection.QueryBuilder<any>,
    private whereInput: Record<string, any>,
    private alias?: string
  ) {}

  parse() {
    this.rootQb.leftJoinRelated(this.getRelationExpression(this.whereInput))
    this.rootQb.andWhere(this.resolveWhereInputFn(this.whereInput))
  }

  private getRelationExpression(
    input: Record<string, any>
  ): Objection.RelationExpression<any> {
    return Object.entries(input)
      .filter(e => !this.isFilter(e[1]))
      .reduce((acc, [k, v]) => {
        if (k === 'AND' || k === 'OR' || k === 'NOT') {
          v.forEach((obj: Record<string, any>) => {
            merge(acc, this.getRelationExpression(obj))
          })

          return acc
        }

        merge(acc, { [k]: this.getRelationExpression(v) })

        return acc
      }, {} as any)
  }

  /** Resolves the where input by returning a function for usage in knex's where function */
  private resolveWhereInputFn(input: Record<string, any>, relation?: string) {
    return (builder: Objection.QueryBuilder<any>) => {
      Object.entries(input).forEach(([k, v]) => {
        if (k === 'AND') {
          builder.andWhere(this.resolveWhereAndFn(v, relation))
        } else if (k === 'OR') {
          builder.andWhere(this.resolveWhereOrFn(v, relation))
        } else if (k === 'NOT') {
          builder.andWhere(this.resolveWhereNotFn(v, relation))
        } else if (this.isFilter(v)) {
          // Hacky way to check if the object is a filter
          const prefix = relation || this.alias
          const key = prefix ? `${prefix}.${k}` : k

          builder.andWhere(this.resolveFilterFn(key, v))
        } else {
          // It's a relation
          const newRelation = relation ? `${relation}:${k}` : k

          builder.andWhere(this.resolveWhereInputFn(v, newRelation))
        }
      })
    }
  }

  /** Resolves the `AND` field by `andWhere` and resolving each list item */
  private resolveWhereAndFn(
    andInput: Record<string, any>[],
    relation?: string
  ) {
    return (builder: Objection.QueryBuilder<any>) => {
      andInput.forEach(input => {
        builder.andWhere(this.resolveWhereInputFn(input, relation))
      })
    }
  }

  /** Resolves the `OR` field by `orWhere` and resolving each list item */
  private resolveWhereOrFn(orInput: Record<string, any>[], relation?: string) {
    return (builder: Objection.QueryBuilder<any>) => {
      orInput.forEach(input => {
        builder.orWhere(this.resolveWhereInputFn(input, relation))
      })
    }
  }

  /** Resolves the `NOT` field by `andWhereNot` and resolving each list item */
  private resolveWhereNotFn(
    notInput: Record<string, any>[],
    relation?: string
  ) {
    return (builder: Objection.QueryBuilder<any>) => {
      notInput.forEach(input => {
        builder.whereNot(this.resolveWhereInputFn(input, relation))
      })
    }
  }

  /**
   * Resolves a filter by interpreting each fields operation.
   * This is filter agnostic and should work for any kind of filter as
   * long as the filter fields follow the convention as the list above.
   * This function returns a function to be used by knex's where function.
   *
   * @example SomeModel.query().andWhere(resolveFilterFn('modelField', { equals: 'something' }))
   */
  private resolveFilterFn(key: string, filter: Record<string, any>) {
    return (builder: Objection.QueryBuilder<any>) => {
      Object.entries(filter).forEach(([k, v]) => {
        // String interpolation in where methods are safe
        // https://github.com/knex/documentation/issues/73#issuecomment-572482153
        switch (k) {
          case 'equals':
            builder.andWhere(key, v)
            break
          case 'not':
            builder.whereNot(key, v)
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

  /**
   * Check if input is a filter, e.g. StringFilter, IntFilter, etc...
   * but cannot determine exactly what kind of filter it is
   */
  private isFilter(input: any) {
    return (
      typeof input === 'object' &&
      Object.keys(input).every(key => this.filterFields.includes(key))
    )
  }
}

export class OrderByInputResolver {
  constructor(
    private rootQb: Objection.QueryBuilder<any>,
    private orderByInput: Record<string, any>,
    private alias?: string
  ) {}

  parse() {
    this.rootQb.leftJoinRelated(this.getRelationExpression(this.orderByInput))
    this.resolveOrderByInput(this.orderByInput)
  }

  private getRelationExpression(
    input: Record<string, any>
  ): Objection.RelationExpression<any> {
    return Object.entries(input)
      .filter(e => typeof e[1] === 'object')
      .reduce((acc, [k, v]) => {
        acc[k] = this.getRelationExpression(v)

        return acc
      }, {} as any)
  }

  private resolveOrderByInput(input: Record<string, any>, relation?: string) {
    Object.entries(input).forEach(([k, v]) => {
      const prefix = relation || this.alias
      const key = prefix ? `${prefix}.${k}` : k

      if (typeof v === 'object') {
        // A nested order (one-to-one relation only)
        const newRelation = relation ? `${relation}:${k}` : k

        this.resolveOrderByInput(v, newRelation)
      } else {
        this.rootQb.orderBy(key, v)
      }
    })
  }
}
