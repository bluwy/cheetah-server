import { enumType, extendType, objectType } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.crud.job()
    t.crud.jobs({
      filtering: true,
      ordering: true,
      pagination: true
    })
  }
})

export const Mutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.crud.createOneJob()
    t.crud.updateOneJob()
    t.crud.deleteOneJob()
  }
})

export const Job = objectType({
  name: 'Job',
  definition (t) {
    t.model.id()
    t.model.dateIssued()
    t.model.customer()
    t.model.assignments()
    t.model.needsFollowUp()
  }
})

export const Assignment = objectType({
  name: 'Assignment',
  definition (t) {
    t.model.id()
    t.model.address()
    t.model.preferTime()
    t.model.checkIn()
    t.model.checkOut()
    t.model.staffPrimary()
    t.model.staffSecondary()
    t.model.tasks()
    t.model.actions()
  }
})

export const Task = objectType({
  name: 'Task',
  definition (t) {
    t.model.id()
    t.model.type()
    t.model.remarks()
  }
})

export const Action = objectType({
  name: 'Action',
  definition (t) {
    t.model.id()
    t.model.remarks()
  }
})

export const TaskType = enumType({
  name: 'TaskType',
  members: [
    'SERVICE',
    'COMPLAINT',
    'DELIVERY',
    'TRANSPORT',
    'OTHERS'
  ]
})
