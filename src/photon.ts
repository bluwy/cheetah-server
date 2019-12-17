import { Photon } from '@prisma/photon'

const photon = new Photon()

process.on('exit', async () => {
  await photon.disconnect()
})

export default photon
