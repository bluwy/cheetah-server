import { createTestClient } from 'apollo-server-testing'
import { server } from '@src/index'

export const newTestClient = () => createTestClient(server)
