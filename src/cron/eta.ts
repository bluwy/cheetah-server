import { Photon } from '@prisma/photon'

const photon = new Photon()

// Start assignments that are planned for today
async function main (): Promise<void> {
  await photon.connect()

  const clientTimezone = +(process.env.CLIENT_TIMEZONE ?? 0)
  const offsetDate = new Date(Date.now() + new Date().getTimezoneOffset() * 1000 + clientTimezone * 60 * 1000)
  const todayStart = new Date(offsetDate.setHours(0, 0, 0, 0))
  const todayEnd = new Date(new Date(offsetDate.getTime() + 1 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0))

  const result = await photon.assignments.updateMany({
    data: {
      eta: false
    },
    where: {
      AND: [
        { eta: true },
        { expired: false },
        {
          preferTime: {
            gte: todayStart,
            lt: todayEnd
          }
        }
      ]
    }
  })

  console.log(`${result.count} assignment(s) released`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((e) => {
  console.error(e)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
}).finally(async () => {
  await photon.disconnect()
})
