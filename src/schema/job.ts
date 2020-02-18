import { UserInputError } from 'apollo-server-express'
import {
  arg,
  enumType,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField
} from 'nexus'
import { Action } from '../models/Action'
import { Assignment } from '../models/Assignment'
import { Customer } from '../models/Customer'
import { Job } from '../models/Job'
import { Staff } from '../models/Staff'
import { Task, taskTypes } from '../models/Task'
import { validateNonNullProps } from '../utils/common'
import { addBaseModelFields, enumFilter, modelTyping } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'
import { NexusInput, NonNullRecord } from '../utils/types'

export const job = queryField('job', {
  type: 'Job',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    return Job.query().findById(id)
  }
})

export const jobs = queryField('jobs', {
  type: 'Job',
  list: true,
  args: {
    skip: intArg(),
    first: intArg(),
    where: arg({ type: 'JobWhereInput' }),
    orderBy: arg({ type: 'JobOrderByInput' })
  },
  async resolve(_, { skip, first, where, orderBy }) {
    skip = skip ?? 0
    first = first != null ? Math.min(first, 50) : 10

    return Job.query()
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where)
      .modify(resolveOrderByInput, orderBy)
  }
})

export const createJob = mutationField('createJob', {
  type: 'Job',
  args: {
    data: arg({ type: 'JobCreateInput', required: true })
  },
  async resolve(_, { data }, { jobService }) {
    const code = await jobService.genJobCode(data.customerId)

    return Job.query()
      .insertGraph({
        code,
        customer: {
          '#dbRef': data.customerId
        },
        assignments: [
          {
            address: data.address,
            preferTime: data.preferTime ?? undefined,
            staffPrimary: {
              '#dbRef': data.staffPrimaryId
            },
            staffSecondary: {
              '#dbRef': data.staffSecondaryId ?? undefined
            },
            tasks: data.tasks.map(v => ({ done: false, ...v }))
          }
        ]
      })
      .returning('*')
  }
})

export const updateJob = mutationField('updateJob', {
  type: 'Job',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'JobUpdateInput', required: true })
  },
  async resolve(_, { id, data }) {
    if (data.customerId != null) {
      Job.relatedQuery('customer')
        .for(id)
        .relate(data.customerId)
    }

    return Job.query().findById(id)
  }
})

export const deleteJob = mutationField('deleteJob', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  async resolve(_, { id }) {
    const deleteCount = await Job.query().deleteById(id)

    if (deleteCount <= 0) {
      throw new UserInputError(`Job not found with id: ${id}`)
    }

    return true
  }
})

// For re-assignment
export const createAssignment = mutationField('createAssignment', {
  type: 'Assignment',
  args: {
    jobId: idArg({ required: true }),
    data: arg({ type: 'AssignmentCreateInput', required: true })
  },
  async resolve(_, { jobId, data }) {
    return Job.relatedQuery('assignments')
      .for(jobId)
      .insertGraph({
        address: data.address,
        preferTime: data.preferTime ?? undefined,
        staffPrimary: {
          '#dbRef': data.staffPrimaryId
        },
        staffSecondary: {
          '#dbRef': data.staffSecondaryId ?? undefined
        },
        tasks: data.tasks.map(v => ({ done: false, ...v }))
      })
      .returning('*')
  }
})

export const adminUpdateAssignment = mutationField('adminUpdateAssignment', {
  type: 'Assignment',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'AdminAssignmentUpdateInput', required: true })
  },
  async resolve(_, { id, data }) {
    return Assignment.query()
      .upsertGraph(
        {
          id,
          address: data.address ?? undefined,
          preferTime: data.preferTime,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          staffPrimary: {
            id: data.staffPrimaryId ?? undefined
          },
          staffSecondary: {
            id: data.staffSecondaryId ?? undefined
          }
        },
        {
          relate: true,
          unrelate: true
        }
      )
      .returning('*')
  }
})

export const setTasks = mutationField('setTasks', {
  type: 'Assignment',
  args: {
    assignmentId: idArg({ required: true }),
    data: arg({ type: 'TaskInput', list: true, required: true })
  },
  async resolve(_, { assignmentId, data }) {
    return Assignment.query().upsertGraph({
      id: assignmentId,
      tasks: validateTasks(data)
    })
  }
})

export const setTasksDone = mutationField('setTasksDone', {
  type: 'Boolean',
  args: {
    ids: idArg({ list: true, required: true })
  },
  async resolve(_, { ids }) {
    const patchCount = await Task.query()
      .findByIds(ids)
      .patch({
        done: true
      })

    if (patchCount <= 0) {
      throw new UserInputError(`Jobs not found with ids: ${ids}`)
    }

    return true
  }
})

export const setActions = mutationField('setActions', {
  type: 'Assignment',
  args: {
    assignmentId: idArg({ required: true }),
    data: arg({ type: 'ActionInput', list: true, required: true })
  },
  async resolve(_, { assignmentId, data }) {
    return Assignment.query().upsertGraph({
      id: assignmentId,
      actions: validateActions(data)
    })
  }
})

export const JobType = objectType({
  name: 'Job',
  rootTyping: modelTyping(Job),
  definition(t) {
    addBaseModelFields(t)
    t.string('code')
    t.field('customer', {
      type: 'Customer',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Customer>(Job, 'customer')
          .load(root)
      }
    })
    t.field('assignments', {
      type: 'Assignment',
      list: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Assignment[]>(Job, 'assignments')
          .load(root)
      }
    })
  }
})

export const AssignmentType = objectType({
  name: 'Assignment',
  rootTyping: modelTyping(Assignment),
  definition(t) {
    addBaseModelFields(t)
    t.string('address')
    t.date('preferTime', { nullable: true })
    t.date('checkIn', { nullable: true })
    t.date('checkOut', { nullable: true })
    t.boolean('expired')
    t.field('staffPrimary', {
      type: 'Staff',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Assignment, Staff>(Assignment, 'staffPrimary')
          .load(root)
      }
    })
    t.field('staffSecondary', {
      type: 'Staff',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Assignment, Staff>(Assignment, 'staffSecondary')
          .load(root)
      }
    })
    t.field('tasks', {
      type: 'Task',
      list: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Assignment, Task[]>(Assignment, 'tasks')
          .load(root)
      }
    })
    t.field('actions', {
      type: 'Action',
      list: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Assignment, Action[]>(Assignment, 'actions')
          .load(root)
      }
    })
  }
})

export const TaskObjectType = objectType({
  name: 'Task',
  rootTyping: modelTyping(Task),
  definition(t) {
    addBaseModelFields(t)
    t.field('type', { type: 'TaskType' })
    t.string('remarks')
    t.boolean('done')
  }
})

export const ActionType = objectType({
  name: 'Action',
  rootTyping: modelTyping(Action),
  definition(t) {
    addBaseModelFields(t)
    t.string('remarks')
  }
})

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition(t) {
    // Job
    t.id('customerId', { required: true })
    // Assignment
    t.string('address', { required: true })
    t.date('preferTime')
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId')
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
  }
})

export const JobUpdateInput = inputObjectType({
  name: 'JobUpdateInput',
  definition(t) {
    t.id('customerId')
  }
})

export const AssignmentCreateInput = inputObjectType({
  name: 'AssignmentCreateInput',
  definition(t) {
    t.string('address', { required: true })
    t.date('preferTime')
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId')
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
  }
})

export const AdminAssignmentUpdateInput = inputObjectType({
  name: 'AdminAssignmentUpdateInput',
  definition(t) {
    t.string('address')
    t.date('preferTime')
    t.date('checkIn')
    t.date('checkOut')
    t.id('staffPrimaryId')
    t.id('staffSecondaryId')
  }
})

export const StaffAssignmentUpdateInput = inputObjectType({
  name: 'StaffAssignmentUpdateInput',
  definition(t) {
    t.date('checkIn')
    t.date('checkOut')
  }
})

export const TaskInput = inputObjectType({
  name: 'TaskInput',
  definition(t) {
    t.id('id')
    t.field('type', { type: 'TaskType' })
    t.string('remarks')
    t.boolean('done')
  }
})

export const TaskCreateInput = inputObjectType({
  name: 'TaskCreateInput',
  definition(t) {
    t.field('type', { type: 'TaskType', required: true })
    t.string('remarks', { required: true })
  }
})

export const ActionInput = inputObjectType({
  name: 'ActionInput',
  definition(t) {
    t.id('id')
    t.string('remarks')
  }
})

export const JobWhereInput = inputObjectType({
  name: 'JobWhereInput',
  definition(t) {
    t.field('code', { type: 'StringFilter' })
    t.field('customer', { type: 'CustomerWhereInput' })
  }
})

export const JobOrderByInput = inputObjectType({
  name: 'JobOrderByInput',
  definition(t) {
    t.field('code', { type: 'OrderByArg' })
    t.field('customer', { type: 'CustomerOrderByInput' })
  }
})

export const TaskTypeFilter = enumFilter('TaskType')

export const TaskType = enumType({
  name: 'TaskType',
  members: taskTypes
})

type TaskInput = NexusInput<'TaskInput'>
type ValidatedTaskInput = NonNullRecord<TaskInput>

/** Validates task input for upsert usage */
function validateTasks(tasks: TaskInput[]): ValidatedTaskInput[] {
  tasks.forEach(task => {
    if (task.id != null) {
      // If has id, means patch, so all other fields can be optional
      // Set all null props to undefined
      validateNonNullProps(task, { mutate: true })
    } else {
      // Is insert
      validateNonNullProps(task)
    }
  })

  return tasks as ValidatedTaskInput[]
}

type ActionInput = NexusInput<'ActionInput'>
type ValidatedActionInput = NonNullRecord<ActionInput>

/** Validates action input for upsert usage */
function validateActions(actions: ActionInput[]): ValidatedActionInput[] {
  actions.forEach(action => {
    if (action.id != null) {
      // If has id, means patch, so all other fields can be optional
      // Set all null props to undefined
      validateNonNullProps(action, { mutate: true })
    } else {
      // Is insert
      validateNonNullProps(action)
    }
  })

  return actions as ValidatedActionInput[]
}
