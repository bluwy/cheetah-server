import { UserInputError } from 'apollo-server'
import { enumType, extendType, objectType, inputObjectType, arg } from 'nexus'

export const Query = extendType({
  type: 'Query',
  definition (t) {
    t.int('jobCount', {
      async resolve (_, __, { photon }) {
        return photon.jobs.count()
      }
    })
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
    t.field('createJob', {
      type: 'Job',
      args: {
        data: arg({ type: 'JobCreateInput', required: true })
      },
      async resolve (_, { data }, { photon }) {
        const customer = await photon.customers.findOne({
          select: {
            companyBelong: {
              select: {
                alias: true
              }
            }
          },
          where: data.customer
        })

        const alias = customer?.companyBelong?.alias

        if (alias == null) {
          throw new UserInputError('Invalid company alias', { invalidArgs: ['data'] })
        }

        const todayJobs = await photon.jobs.findMany({
          select: { id: true },
          where: {
            dateIssued: {
              gte: new Date(new Date().setUTCHours(0, 0, 0, 0))
            }
          }
        })

        const code = [
          alias,
          getDDMMYY(),
          (todayJobs.length + 1).toString().padStart(3, '0')
        ].join('-')

        return photon.jobs.create({
          data: {
            code,
            customer: {
              connect: data.customer
            },
            assignments: {
              create: {
                address: data.address,
                staffPrimary: { connect: data.staffPrimary },
                staffSecondary: { connect: data.staffSecondary },
                tasks: { create: data.tasks }
              }
            }
          },
          include: {
            assignments: true,
            customer: true
          }
        })
      }
    })

    t.field('updateJob', {
      type: 'Job',
      args: {
        data: arg({ type: 'JobUpdateInput', required: true }),
        where: arg({ type: 'JobWhereUniqueInput', required: true })
      },
      async resolve (_, { data, where }, { photon }) {
        return photon.jobs.update({
          data: {
            customer: { connect: data.customer },
            needsFollowUp: data.needsFollowUp
          },
          include: {
            assignments: true,
            customer: true
          },
          where
        })
      }
    })

    t.crud.deleteOneJob({ alias: 'deleteJob' })

    t.field('createAssignment', {
      type: 'Assignment',
      args: {
        data: arg({ type: 'AssignmentCreateInput', required: true }),
        jobWhere: arg({ type: 'JobWhereUniqueInput', required: true })
      },
      async resolve (_, { data, jobWhere }, { photon }) {
        // Set previous assignments expired
        await photon.assignments.updateMany({
          data: {
            expired: true
          },
          where: {
            job: jobWhere
          }
        })

        return photon.assignments.create({
          data: {
            address: data.address,
            staffPrimary: { connect: data.staffPrimary },
            staffSecondary: { connect: data.staffSecondary },
            tasks: { create: data.tasks },
            job: { connect: jobWhere }
          },
          include: {
            staffPrimary: true,
            staffSecondary: true,
            actions: true,
            tasks: true
          }
        })
      }
    })

    t.field('updateAssignment', {
      type: 'Assignment',
      args: {
        data: arg({ type: 'AssignmentUpdateInput', required: true }),
        where: arg({ type: 'AssignmentWhereUniqueInput', required: true })
      },
      async resolve (_, { data, where }, { photon }) {
        return photon.assignments.update({
          data: {
            address: data.address,
            preferTime: data.preferTime,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            staffPrimary: { connect: data.staffPrimary },
            staffSecondary: { connect: data.staffSecondary }
          },
          include: {
            staffPrimary: true,
            staffSecondary: true,
            actions: true,
            tasks: true
          },
          where
        })
      }
    })

    t.field('createTask', {
      type: 'Task',
      args: {
        data: arg({ type: 'TaskCreateInput', required: true }),
        assignmentWhere: arg({ type: 'AssignmentWhereUniqueInput', required: true })
      },
      async resolve (_, { data, assignmentWhere }, { photon }) {
        return photon.tasks.create({
          data: {
            type: data.type,
            remarks: data.remarks,
            assignment: { connect: assignmentWhere }
          }
        })
      }
    })

    t.field('updateTask', {
      type: 'Task',
      args: {
        data: arg({ type: 'TaskUpdateInput', required: true }),
        where: arg({ type: 'TaskWhereUniqueInput', required: true })
      },
      async resolve (_, { data, where }, { user, photon }) {
        return photon.tasks.update({
          data: {
            type: user.isAdmin() ? data.type : undefined,
            remarks: user.isAdmin() ? data.remarks : undefined,
            done: data.done
          },
          where
        })
      }
    })

    t.crud.deleteOneTask({ alias: 'deleteTask' })

    t.field('createAction', {
      type: 'Action',
      args: {
        data: arg({ type: 'ActionCreateInput', required: true }),
        assignmentWhere: arg({ type: 'AssignmentWhereUniqueInput', required: true })
      },
      async resolve (_, { data, assignmentWhere }, { photon }) {
        return photon.actions.create({
          data: {
            remarks: data.remarks,
            assignment: { connect: assignmentWhere }
          }
        })
      }
    })

    t.crud.updateOneAction({ alias: 'updateAction' })
    t.crud.deleteOneAction({ alias: 'deleteAction' })
  }
})

export const Job = objectType({
  name: 'Job',
  definition (t) {
    t.model.id()
    t.model.code()
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
    t.model.expired()
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

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition (t) {
    t.field('customer', { type: 'CustomerWhereUniqueInput', required: true })
    t.string('address', { required: true })
    t.field('staffPrimary', { type: 'StaffWhereUniqueInput', required: true })
    t.field('staffSecondary', { type: 'StaffWhereUniqueInput' })
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
  }
})

export const JobUpdateInput = inputObjectType({
  name: 'JobUpdateInput',
  definition (t) {
    t.field('customer', { type: 'CustomerWhereUniqueInput' })
    t.boolean('needsFollowUp')
  }
})

export const AssignmentCreateInput = inputObjectType({
  name: 'AssignmentCreateInput',
  definition (t) {
    t.string('address', { required: true })
    t.field('preferTime', { type: 'DateTime' })
    t.field('staffPrimary', { type: 'StaffWhereUniqueInput', required: true })
    t.field('staffSecondary', { type: 'StaffWhereUniqueInput' })
    t.list.field('tasks', { type: 'TaskCreateInput', required: true })
  }
})

export const AssignmentUpdateInput = inputObjectType({
  name: 'AssignmentUpdateInput',
  definition (t) {
    t.string('address')
    t.field('preferTime', { type: 'DateTime' })
    t.field('checkIn', { type: 'DateTime' })
    t.field('checkOut', { type: 'DateTime' })
    t.field('staffPrimary', { type: 'StaffWhereUniqueInput' })
    t.field('staffSecondary', { type: 'StaffWhereUniqueInput' })
  }
})

export const TaskCreateInput = inputObjectType({
  name: 'TaskCreateInput',
  definition (t) {
    t.field('type', { type: 'TaskType', required: true })
    t.string('remarks', { required: true })
  }
})

export const TaskUpdateInput = inputObjectType({
  name: 'TaskUpdateInput',
  definition (t) {
    t.field('type', { type: 'TaskType' })
    t.string('remarks')
    t.boolean('done')
  }
})

export const ActionCreateInput = inputObjectType({
  name: 'ActionCreateInput',
  definition (t) {
    t.string('remarks', { required: true })
  }
})

export const ActionUpdateInput = inputObjectType({
  name: 'ActionUpdateInput',
  definition (t) {
    t.string('remarks')
  }
})

export const AssignmentWhereUniqueInput = inputObjectType({
  name: 'AssignmentWhereUniqueInput',
  definition (t) {
    t.id('id')
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

function getDDMMYY (): string {
  const date = new Date()

  const dd = date.getUTCDate().toString().padStart(2, '0')
  const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const yy = date.getUTCFullYear().toString().substr(-2)

  return dd + mm + yy
}
