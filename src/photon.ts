import { Photon } from '@prisma/photon'

const photon = new Photon()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('beforeExit', async () => photon.disconnect())

export default photon
