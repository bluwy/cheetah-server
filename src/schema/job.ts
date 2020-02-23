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
import { raw } from 'objection'
import { Action } from '../models/Action'
import { Assignment } from '../models/Assignment'
import { Customer } from '../models/Customer'
import { Job } from '../models/Job'
import { Staff } from '../models/Staff'
import { Task, TaskType } from '../models/Task'
import { ifUser, isAdmin, isAuthed, isStaff } from '../utils/auth'
import { validateNonNullProps } from '../utils/common'
import { addBaseModelFields, enumFilter, modelTyping } from '../utils/nexus'
import { resolveOrderByInput, resolveWhereInput } from '../utils/objection'
import {
  NexusInput,
  NonNullRecord,
  RequiredRecord,
  RequiredRecordBy
} from '../utils/types'

export const jobCount = queryField('jobCount', {
  type: 'Int',
  args: {
    where: arg({ type: 'JobWhereInput' })
  },
  authorize: ifUser(isAuthed),
  async resolve(_, { where }) {
    const result: any = await Job.query()
      .alias('j')
      .modify(resolveWhereInput, where, 'j')
      .count('j.id as count')
      .first()

    return result.count
  }
})

export const job = queryField('job', {
  type: 'Job',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAuthed),
  async resolve(_, { id }) {
    return Job.query().findById(id)
  }
})

export const jobs = queryField('jobs', {
  type: 'Job',
  list: true,
  args: {
    skip: intArg({ default: 0 }),
    first: intArg({ default: 10 }),
    where: arg({ type: 'JobWhereInput' }),
    orderBy: arg({ type: 'JobOrderByInput' })
  },
  authorize: ifUser(isAuthed),
  async resolve(_, { skip, first, where, orderBy }) {
    if (skip == null) {
      skip = 0
    } else if (skip < 0) {
      throw new UserInputError(`'skip' must be >= 0`)
    }

    if (first == null) {
      first = 10
    } else if (first <= 0 || first > 30) {
      throw new UserInputError(`'first' must be > 0 and <= 30`)
    }

    return Job.query()
      .alias('j')
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where, 'j')
      .modify(resolveOrderByInput, orderBy, 'j')
  }
})

export const createJob = mutationField('createJob', {
  type: 'Job',
  args: {
    data: arg({ type: 'JobCreateInput', required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { data }, { jobService }) {
    const code = await jobService.genJobCode(data.customerId)

    return Job.transaction(async trx => {
      const job = await Job.query(trx)
        .insert({
          code,
          customerId: data.customerId
        })
        .returning('*')

      const assignment = await Assignment.query(trx)
        .insert({
          address: data.address,
          preferTime: data.preferTime,
          staffPrimaryId: data.staffPrimaryId,
          staffSecondaryId: data.staffSecondaryId,
          jobId: job.id
        })
        .returning('id')

      await Task.query(trx).insert(
        data.tasks.map(v => ({ assignmentId: assignment.id, ...v }))
      )

      return job
    })
  }
})

export const updateJob = mutationField('updateJob', {
  type: 'Job',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'JobUpdateInput', required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id, data }) {
    return Job.query()
      .findById(id)
      .patch({
        customerId: data.customerId ?? undefined
      })
      .returning('*')
      .first()
  }
})

export const deleteJob = mutationField('deleteJob', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifUser(isAdmin),
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
  authorize: ifUser(isAdmin),
  async resolve(_, { jobId, data }) {
    return Assignment.transaction(async trx => {
      const assignment = await Assignment.query(trx)
        .insert({
          address: data.address,
          preferTime: data.preferTime,
          staffPrimaryId: data.staffPrimaryId,
          staffSecondaryId: data.staffSecondaryId,
          jobId: jobId
        })
        .returning('*')

      await Task.query(trx).insert(
        data.tasks.map(v => ({ assignmentId: assignment.id, ...v }))
      )

      return assignment
    })
  }
})

export const adminUpdateAssignment = mutationField('adminUpdateAssignment', {
  type: 'Assignment',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'AdminAssignmentUpdateInput', required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { id, data }) {
    return Assignment.query()
      .findById(id)
      .patch({
        address: data.address ?? undefined,
        preferTime: data.preferTime,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        staffPrimaryId: data.staffPrimaryId ?? undefined,
        staffSecondaryId: data.staffSecondaryId
      })
      .returning('*')
      .first()
  }
})

export const staffUpdateAssignment = mutationField('staffUpdateAssignment', {
  type: 'Assignment',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'StaffAssignmentUpdateInput', required: true })
  },
  authorize: ifUser(isStaff),
  async resolve(_, { id, data }) {
    return Assignment.query()
      .findById(id)
      .patch({
        checkIn: data.checkIn,
        checkOut: data.checkOut
      })
      .returning('*')
      .first()
  }
})

export const setTasks = mutationField('setTasks', {
  type: 'Boolean',
  args: {
    assignmentId: idArg({ required: true }),
    data: arg({ type: 'TaskInput', list: true, required: true })
  },
  authorize: ifUser(isAdmin),
  async resolve(_, { assignmentId, data }) {
    validateTasks(data)

    return Task.transaction(async trx => {
      const tasks = await Assignment.relatedQuery('tasks', trx)
        .for(assignmentId)
        .select('id')

      const taskIds = tasks.map(v => v.id)

      // Force cast after `validateTasks`
      const toInsertData = (data.filter(
        v => v.id == null
      ) as any) as InsertTaskInput[]

      const toUpdateData = (data.filter(
        v => v.id != null
      ) as any) as UpdateTaskInput[]

      const toDeleteIds = taskIds.filter(
        v => !toUpdateData.some(w => w.id === v)
      )

      if (toDeleteIds.length > 0) {
        await Task.query(trx)
          .delete()
          .whereIn('id', toDeleteIds)
      }

      if (toUpdateData.length > 0) {
        await Task.query(trx)
          .patch({
            type: raw('COALESCE(c.type, type)'),
            remarks: raw('COALESCE(c.remarks, remarks)'),
            done: raw('COALESCE(c.done, done)')
          })
          .whereRaw(`id = c.id`)
          .from(
            raw(
              `
              (
                VALUES ${toUpdateData.map(() => '(?, ?, ?, ?)').join(', ')}
              ) AS c(type, remarks, done, id)
            `,
              toUpdateData.flatMap(v => [
                v.type ?? null,
                v.remarks ?? null,
                v.done ?? null,
                v.id
              ])
            )
          )
          .debug()
      }

      if (toInsertData.length > 0) {
        await Task.query(trx).insert(
          toInsertData.map(v => ({
            type: v.type,
            remarks: v.remarks,
            done: v.done ?? false
          }))
        )
      }

      return true
    })
  }
})

export const setTasksDone = mutationField('setTasksDone', {
  type: 'Boolean',
  args: {
    ids: idArg({ list: true, required: true })
  },
  authorize: ifUser(isStaff),
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
  type: 'Boolean',
  args: {
    assignmentId: idArg({ required: true }),
    data: arg({ type: 'ActionInput', list: true, required: true })
  },
  authorize: ifUser(isAuthed),
  async resolve(_, { assignmentId, data }) {
    validateActions(data)

    return Action.transaction(async trx => {
      const actions = await Assignment.relatedQuery('actions', trx)
        .for(assignmentId)
        .select('id')

      const actionIds = actions.map(v => v.id)

      // Force cast after `validateActions`
      const toInsertData = (data.filter(
        v => v.id == null
      ) as any) as InsertActionInput[]

      const toUpdateData = (data.filter(
        v => v.id != null
      ) as any) as UpdateActionInput[]

      const toDeleteIds = actionIds.filter(
        v => !toUpdateData.some(w => w.id === v)
      )

      if (toDeleteIds.length > 0) {
        await Action.query(trx)
          .delete()
          .whereIn('id', toDeleteIds)
      }

      if (toUpdateData.length > 0) {
        await Action.query(trx)
          .patch({
            remarks: raw('COALESCE(c.remarks, remarks)')
          })
          .whereRaw(`id = c.id`)
          .from(
            raw(
              `
              (
                VALUES ${toUpdateData.map(() => '(?, ?)').join(', ')}
              ) AS c(remarks, id)
            `,
              toUpdateData.flatMap(v => [v.remarks ?? null, v.id])
            )
          )
          .debug()
      }

      if (toInsertData.length > 0) {
        await Action.query(trx).insert(
          toInsertData.map(v => ({
            remarks: v.remarks
          }))
        )
      }

      return true
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
    t.list.field('AND', { type: 'JobWhereInput' })
    t.list.field('OR', { type: 'JobWhereInput' })
    t.list.field('NOT', { type: 'JobWhereInput' })
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

export const TaskTypeEnum = enumType({
  name: 'TaskType',
  members: Object.values(TaskType),
  rootTyping: {
    path: '../models/Task',
    name: 'TaskType'
  }
})

type TaskInput = NexusInput<'TaskInput'>
type InsertTaskInput = RequiredRecordBy<
  Omit<TaskInput, 'id'>,
  'type' | 'remarks'
>
type UpdateTaskInput = NonNullRecord<TaskInput>

/** Validates task input for insert/update usage */
function validateTasks(tasks: TaskInput[]) {
  tasks.forEach(task => {
    if (task.id != null) {
      // If has id, means patch, so all other fields can be optional
      // Set all null props to undefined
      validateNonNullProps(task, { mutate: true })
    } else {
      // Is insert
      delete task.id
      validateNonNullProps(task, { props: ['type', 'remarks'] })
    }
  })
}

type ActionInput = NexusInput<'ActionInput'>
type InsertActionInput = RequiredRecord<Omit<ActionInput, 'id'>>
type UpdateActionInput = NonNullRecord<ActionInput>

/** Validates action input for insert/update usage */
function validateActions(actions: ActionInput[]) {
  actions.forEach(action => {
    if (action.id != null) {
      // If has id, means patch, so all other fields can be optional
      // Set all null props to undefined
      validateNonNullProps(action, { mutate: true })
    } else {
      // Is insert
      delete action.id
      validateNonNullProps(action, { props: ['remarks'] })
    }
  })
}
