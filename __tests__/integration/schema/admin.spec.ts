import { gql } from 'apollo-server-express'
import {
  newTestClient,
  initDatabase,
  setupDatabase,
  cleanupDatabase
} from '@tests/utils'
import { admins } from '@tests/seed/admin'
import { Admin } from '@src/models/Admin'

const SUDO_PASSWORD = process.env.SUDO_PASSWORD

jest.setTimeout(10000)
jest.mock('@src/services/session')
jest.mock('@src/services/password')

describe('admin', () => {
  const { query, mutate } = newTestClient()

  beforeAll(async () => {
    await initDatabase()
  })

  beforeEach(async () => {
    await setupDatabase()
  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  it('should provide admin count', async () => {
    expect.assertions(1)
    const { data } = await query({
      query: gql`
        {
          adminCount
        }
      `
    })
    expect(data?.adminCount).toEqual(admins.length)
  })

  it('should return one admin based on id', async () => {
    expect.assertions(1)
    const testAdmin = await Admin.query().first()
    const { data } = await query({
      query: gql`
        {
          admin(id: "${testAdmin.id}") {
            username
          }
        }
      `
    })
    expect(data?.admin.username).toEqual(testAdmin.username)
  })

  it('should return all admins', async () => {
    expect.assertions(1)
    const { data } = await query({
      query: gql`
        {
          admins {
            id
          }
        }
      `
    })
    expect(data?.admins.length).toEqual(admins.length)
  })

  it('should create an admin', async () => {
    expect.assertions(2)
    const { data } = await mutate({
      mutation: gql`
        mutation {
          adminCreate(
            data: { username: "hello", password: "world", privilege: BASIC }
          ) {
            username
          }
        }
      `
    })
    expect(data?.adminCreate).toEqual({ username: 'hello' })
    const findAdmin = await Admin.query().findOne({ username: 'hello' })
    expect(findAdmin).toBeDefined()
  })

  it('should delete an admin', async () => {
    expect.assertions(2)
    const testAdmin = await Admin.query().first()
    const { data } = await mutate({
      mutation: gql`
        mutation {
          adminDelete(id: "${testAdmin.id}")
        }
      `
    })
    expect(data?.adminDelete).toEqual(true)
    const findAdmin = await Admin.query().findOne({ id: testAdmin.id })
    expect(findAdmin).toBeUndefined()
  })

  it('should update new password when given old password', async () => {
    expect.assertions(2)
    const testAdmin = await Admin.query().findOne({
      username: admins[0].username
    })
    const { data } = await mutate({
      mutation: gql`
        mutation {
          adminUpdatePassword(
            id: "${testAdmin.id}"
            oldPassword: "${admins[0].password}"
            newPassword: "abc"
          )
        }
      `
    })
    expect(data?.adminUpdatePassword).toEqual(true)
    const findAdmin = await Admin.query().findOne({
      username: admins[0].username
    })
    expect(findAdmin.hash).not.toEqual(testAdmin.hash)
  })

  it('should login admin', async () => {
    expect.assertions(1)
    const { data } = await mutate({
      mutation: gql`
        mutation {
          adminLogin(
            username: "${admins[0].username}"
            password: "${admins[0].password}"
          )
        }
      `
    })
    expect(data?.adminLogin).toEqual(true)
  })

  it('should not login admin if wrong username or password', async () => {
    expect.assertions(1)
    const { errors } = await mutate({
      mutation: gql`
        mutation {
          adminLogin(username: "blabla", password: "doot doot")
        }
      `
    })
    expect(errors).toBeDefined()
  })

  it('should generate a reset password token', async () => {
    expect.assertions(1)
    const { data } = await mutate({
      mutation: gql`
        mutation {
          adminGetResetPasswordToken(
            sudoPassword: "${SUDO_PASSWORD}"
            username: "${admins[0].username}"
          )
        }
      `
    })
    expect(typeof data?.adminGetResetPasswordToken === 'string').toEqual(true)
  })
})
