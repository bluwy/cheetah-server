import { GraphQLDateTime } from 'graphql-iso-date'
import { asNexusMethod, enumType, inputObjectType } from 'nexus'

export const DateTime = asNexusMethod(GraphQLDateTime, 'date')

export const orderByArg = enumType({
  name: 'OrderByArg',
  members: ['ASC', 'DESC']
})

export const stringFilter = inputObjectType({
  name: 'StringFilter',
  definition(t) {
    t.string('equals')
    t.string('not')
    t.list.string('in')
    t.list.string('notIn')
    t.string('lt')
    t.string('lte')
    t.string('gt')
    t.string('gte')
    t.string('contains')
    t.string('startsWith')
    t.string('endsWith')
  }
})

export const intFilter = inputObjectType({
  name: 'IntFilter',
  definition(t) {
    t.int('equals')
    t.int('not')
    t.list.int('in')
    t.list.int('notIn')
    t.int('lt')
    t.int('lte')
    t.int('gt')
    t.int('gte')
  }
})

export const floatFilter = inputObjectType({
  name: 'FloatFilter',
  definition(t) {
    t.float('equals')
    t.float('not')
    t.list.float('in')
    t.list.float('notIn')
    t.float('lt')
    t.float('lte')
    t.float('gt')
    t.float('gte')
  }
})

export const booleanFilter = inputObjectType({
  name: 'BooleanFilter',
  definition(t) {
    t.boolean('equals')
    t.boolean('not')
  }
})

export const dateTimeFilter = inputObjectType({
  name: 'DateTimeFilter',
  definition(t) {
    t.date('equals')
    t.date('not')
    t.list.date('in')
    t.list.date('notIn')
    t.date('lt')
    t.date('lte')
    t.date('gt')
    t.date('gte')
  }
})
