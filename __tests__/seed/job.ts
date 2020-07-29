import { Job, JobState } from '@src/models/Job'
import { Customer } from '@src/models/Customer'
import { Staff } from '@src/models/Staff'
import { TaskType } from '@src/models/Task'

const jobs = [
  // Freshly created job
  {
    address: 'ahhhh',
    startDate: new Date(),
    checkIn: null,
    checkOut: null,
    state: null,
    customerIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1,
    tasks: [
      {
        type: TaskType.Service,
        remarks: 'fix this',
        done: false
      }
    ],
    actions: []
  },
  // Current WIP job
  {
    address: 'ahhhh',
    startDate: new Date(),
    checkIn: new Date(),
    checkOut: null,
    state: null,
    customerIndex: 0,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1,
    tasks: [
      {
        type: TaskType.Service,
        remarks: 'fix this',
        done: false
      }
    ],
    actions: []
  }
]

export async function seedJob() {
  const customers = await Customer.query()
  const staffs = await Staff.query()

  const insertJobs = await Promise.all(
    jobs.map(async job => {
      const {
        customerIndex: ci,
        staffPrimaryIndex: spi,
        staffSecondaryIndex: ssi,
        ...others
      } = job

      return {
        ...others,
        customerId: customers[ci].id,
        staffPrimaryId: staffs[spi].id,
        staffSecondaryId: ssi ? staffs[ssi].id : null
      }
    })
  )

  await Job.query().insert([{}])
}
