import { Job, JobState } from '../models/Job'
import { Customer } from '../models/Customer'
import { Staff } from '../models/Staff'
import { TaskType } from '../models/Task'

const jobs = [
  // Freshly created job
  {
    address: 'ahhhh',
    code: 'K1',
    startDate: new Date(),
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
    address: 'world',
    code: 'K2',
    startDate: new Date(),
    checkIn: new Date(),
    customerIndex: 0,
    staffPrimaryIndex: 0,
    tasks: [
      {
        type: TaskType.Service,
        remarks: 'fix that',
        done: false
      }
    ],
    actions: []
  },
  // Done
  {
    address: 'earth',
    code: 'K3',
    startDate: new Date(),
    checkIn: new Date(),
    // 1 hour
    checkOut: new Date(Date.now() + 1 * 60 * 60 * 1000),
    customerIndex: 1,
    staffPrimaryIndex: 0,
    staffSecondaryIndex: 1,
    state: JobState.Done,
    tasks: [
      {
        type: TaskType.Delivery,
        remarks: 'gift',
        done: true
      }
    ],
    actions: [
      {
        remarks: 'got present back wow'
      }
    ]
  },
  // Reviewed
  {
    address: 'moon',
    code: 'K4',
    startDate: new Date(),
    checkIn: new Date(),
    // 2 hours
    checkOut: new Date(Date.now() + 2 * 60 * 60 * 1000),
    customerIndex: 2,
    staffPrimaryIndex: 1,
    staffSecondaryIndex: 0,
    state: JobState.Reviewed,
    tasks: [
      {
        type: TaskType.Others,
        remarks: 'fart',
        done: true
      }
    ],
    actions: []
  }
]

export async function seedJob() {
  const customers = await Customer.query()
  const staffs = await Staff.query()

  const insertJobs = jobs.map(job => {
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
      staffSecondaryId: ssi ? staffs[ssi].id : undefined
    }
  })

  await Job.query().insertGraph(insertJobs)
}
