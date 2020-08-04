import { UserInputError } from 'apollo-server-express'
import { merge } from 'lodash'
import {
  arg,
  enumType,
  idArg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  queryField,
  stringArg
} from 'nexus'
import { raw } from 'objection'
import { Action } from '../models/Action'
import { Customer } from '../models/Customer'
import { Job, JobState } from '../models/Job'
import { Staff } from '../models/Staff'
import { Task, TaskType } from '../models/Task'
import { ifIs, AuthType } from '../utils/auth'
import { validateNonNullProps } from '../utils/common'
import {
  addBaseModelFields,
  addBaseModelOrderByFields,
  addBaseModelWhereFields,
  enumFilter
} from '../utils/nexus'
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
    query: stringArg(),
    where: arg({ type: 'JobWhereInput' })
  },
  authorize: ifIs(AuthType.Authed),
  async resolve(_, { query, where }) {
    if (query) {
      merge(where, queryToWhereInput(query))
    }

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
  authorize: ifIs(AuthType.Authed),
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
    query: stringArg(),
    where: arg({ type: 'JobWhereInput' }),
    orderBy: arg({ type: 'JobOrderByInput' })
  },
  authorize: ifIs(AuthType.Authed),
  async resolve(_, { skip, first, query, where, orderBy }) {
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

    if (query) {
      merge(where, queryToWhereInput(query))
    }

    return Job.query()
      .alias('j')
      .offset(skip)
      .limit(first)
      .modify(resolveWhereInput, where, 'j')
      .modify(resolveOrderByInput, orderBy, 'j')
  }
})

export const jobCreate = mutationField('jobCreate', {
  type: 'Job',
  args: {
    data: arg({ type: 'JobCreateInput', required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { data }, { jobService }) {
    const code = await jobService.genJobCode(data.customerId)

    return Job.transaction(async trx => {
      const job = await Job.query(trx)
        .insert({
          code,
          address: data.address,
          startDate: data.startDate,
          customerId: data.customerId,
          staffPrimaryId: data.staffPrimaryId,
          staffSecondaryId: data.staffSecondaryId
        })
        .returning('*')

      await Task.query(trx).insert(
        data.tasks.map(v => ({ jobId: job.id, ...v }))
      )

      return job
    })
  }
})

export const jobUpdateByAdmin = mutationField('jobUpdateByAdmin', {
  type: 'Job',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'JobUpdateByAdminInput', required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { id, data }) {
    return Job.query()
      .findById(id)
      .patch({
        customerId: data.customerId ?? undefined,
        address: data.address ?? undefined,
        startDate: data.startDate ?? undefined,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        staffPrimaryId: data.staffPrimaryId ?? undefined,
        staffSecondaryId: data.staffSecondaryId,
        state: data.state ?? undefined
      })
      .returning('*')
      .first()
  }
})

export const jobUpdateByStaff = mutationField('jobUpdateByStaff', {
  type: 'Job',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'JobUpdateByStaffInput', required: true })
  },
  authorize: ifIs(AuthType.Staff),
  async resolve(_, { id, data }) {
    return Job.query()
      .findById(id)
      .patch({
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        state: data.state ?? undefined
      })
      .returning('*')
      .first()
  }
})

export const jobDelete = mutationField('jobDelete', {
  type: 'Boolean',
  args: {
    id: idArg({ required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { id }) {
    const deleteCount = await Job.query().deleteById(id)

    if (deleteCount <= 0) {
      throw new UserInputError(`Job not found with id: ${id}`)
    }

    return true
  }
})

export const jobReassign = mutationField('jobReassign', {
  type: 'JobReassignResponse',
  args: {
    id: idArg({ required: true }),
    data: arg({ type: 'JobReassignInput', required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { id, data }) {
    return Job.transaction(async trx => {
      const oriJob = await Job.query(trx)
        .findById(id)
        .patch({
          state: JobState.Expired
        })
        .where('state', '!=', JobState.Expired)
        .returning('*')
        .first()

      if (oriJob == null) {
        throw new UserInputError('Invalid job id or job already expired')
      }

      const newJob = await Job.query(trx)
        .insert({
          code: oriJob.code,
          address: data.address,
          startDate: data.startDate,
          customerId: oriJob.customerId,
          staffPrimaryId: data.staffPrimaryId,
          staffSecondaryId: data.staffSecondaryId
        })
        .returning('*')

      await Task.query(trx).insert(
        data.tasks.map(v => ({
          type: v.type,
          remarks: v.remarks,
          jobId: newJob.id
        }))
      )

      return { oriJob, newJob }
    })
  }
})

export const jobSetTasks = mutationField('jobSetTasks', {
  type: 'Boolean',
  args: {
    jobId: idArg({ required: true }),
    data: arg({ type: 'TaskInput', list: true, required: true })
  },
  authorize: ifIs(AuthType.Admin),
  async resolve(_, { jobId, data }) {
    validateTasks(data)

    return Task.transaction(async trx => {
      const tasks = await Job.relatedQuery('tasks', trx)
        .for(jobId)
        .select('id')

      const taskIds = tasks.map(v => v.id)

      // Force cast after `validateTasks`
      const toInsertData = data.filter(v => v.id == null) as InsertTaskInput[]

      const toUpdateData = data.filter(v => v.id != null) as UpdateTaskInput[]

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
            done: v.done ?? false,
            jobId: jobId
          }))
        )
      }

      return true
    })
  }
})

export const jobSetTasksDone = mutationField('jobSetTasksDone', {
  type: 'Boolean',
  args: {
    ids: idArg({ list: true, required: true })
  },
  authorize: ifIs(AuthType.Staff),
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

export const jobSetActions = mutationField('jobSetActions', {
  type: 'Boolean',
  args: {
    jobId: idArg({ required: true }),
    data: arg({ type: 'ActionInput', list: true, required: true })
  },
  authorize: ifIs(AuthType.Authed),
  async resolve(_, { jobId, data }) {
    validateActions(data)

    return Action.transaction(async trx => {
      const actions = await Job.relatedQuery('actions', trx)
        .for(jobId)
        .select('id')

      const actionIds = actions.map(v => v.id)

      // Force cast after `validateActions`
      const toInsertData = data.filter(v => v.id == null) as InsertActionInput[]

      const toUpdateData = data.filter(v => v.id != null) as UpdateActionInput[]

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
            remarks: v.remarks,
            jobId: jobId
          }))
        )
      }

      return true
    })
  }
})

export const JobType = objectType({
  name: 'Job',
  definition(t) {
    addBaseModelFields(t)
    t.string('code')
    t.string('address')
    t.date('startDate')
    t.date('checkIn', { nullable: true })
    t.date('checkOut', { nullable: true })
    t.field('state', { type: 'JobState', nullable: true })
    t.field('customer', {
      type: 'Customer',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Customer>(Job, 'customer')
          .load(root)
      }
    })
    t.field('staffPrimary', {
      type: 'Staff',
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Staff>(Job, 'staffPrimary')
          .load(root)
      }
    })
    t.field('staffSecondary', {
      type: 'Staff',
      nullable: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Staff>(Job, 'staffSecondary')
          .load(root)
      }
    })
    t.field('tasks', {
      type: 'Task',
      list: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Task[]>(Job, 'tasks')
          .load(root)
      }
    })
    t.field('actions', {
      type: 'Action',
      list: true,
      resolve: async (root, _, { dataLoaderService }) => {
        return dataLoaderService
          .modelRelatedLoader<Job, Action[]>(Job, 'actions')
          .load(root)
      }
    })
  },
  rootTyping: {
    path: '../models/Job',
    name: 'Job'
  }
})

export const TaskObjectType = objectType({
  name: 'Task',
  definition(t) {
    addBaseModelFields(t)
    t.field('type', { type: 'TaskType' })
    t.string('remarks')
    t.boolean('done')
  },
  rootTyping: {
    path: '../models/Task',
    name: 'Task'
  }
})

export const ActionType = objectType({
  name: 'Action',
  definition(t) {
    addBaseModelFields(t)
    t.string('remarks')
  },
  rootTyping: {
    path: '../models/Action',
    name: 'Action'
  }
})

export const JobReassignResponse = objectType({
  name: 'JobReassignResponse',
  definition(t) {
    t.field('oriJob', { type: 'Job' })
    t.field('newJob', { type: 'Job' })
  }
})

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition(t) {
    t.id('customerId', { required: true })
    t.string('address', { required: true })
    t.date('startDate', { required: true })
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId')
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
  }
})

export const JobUpdateByAdminInput = inputObjectType({
  name: 'JobUpdateByAdminInput',
  definition(t) {
    t.id('customerId')
    t.string('address')
    t.date('startDate')
    t.date('checkIn')
    t.date('checkOut')
    t.field('state', { type: 'JobState' })
    t.id('staffPrimaryId')
    t.id('staffSecondaryId')
  }
})

export const JobUpdateByStaffInput = inputObjectType({
  name: 'JobUpdateByStaffInput',
  definition(t) {
    t.date('checkIn')
    t.date('checkOut')
    t.field('state', { type: 'JobState' })
  }
})

export const JobReassignInput = inputObjectType({
  name: 'JobReassignInput',
  definition(t) {
    t.string('address', { required: true })
    t.date('startDate', { required: true })
    t.id('staffPrimaryId', { required: true })
    t.id('staffSecondaryId')
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
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
    addBaseModelWhereFields(t)
    t.field('code', { type: 'StringFilter' })
    t.field('address', { type: 'StringFilter' })
    t.field('startDate', { type: 'DateTimeFilter' })
    t.field('checkIn', { type: 'DateTimeFilter' })
    t.field('checkOut', { type: 'DateTimeFilter' })
    t.field('state', { type: 'JobStateFilter' })
    t.field('customer', { type: 'CustomerWhereInput' })
    t.field('staffPrimary', { type: 'StaffWhereInput' })
    t.field('staffSecondary', { type: 'StaffWhereInput' })
  }
})

export const JobOrderByInput = inputObjectType({
  name: 'JobOrderByInput',
  definition(t) {
    addBaseModelOrderByFields(t)
    t.field('code', { type: 'OrderByArg' })
    t.field('address', { type: 'OrderByArg' })
    t.field('startDate', { type: 'OrderByArg' })
    t.field('checkIn', { type: 'OrderByArg' })
    t.field('checkOut', { type: 'OrderByArg' })
    t.field('state', { type: 'OrderByArg' })
    t.field('customer', { type: 'CustomerOrderByInput' })
    t.field('staffPrimary', { type: 'StaffOrderByInput' })
    t.field('staffSecondary', { type: 'StaffOrderByInput' })
  }
})

export const JobStateFilter = enumFilter('JobState')

export const JobStateEnum = enumType({
  name: 'JobState',
  members: Object.values(JobState),
  rootTyping: {
    path: '../models/Job',
    name: 'JobState'
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

function queryToWhereInput(query: string) {
  return {
    code: { contains: query },
    address: { contains: query }
  }
}

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
