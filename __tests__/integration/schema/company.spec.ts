import { gql } from 'apollo-server-express'
import { companies } from '@tests/seed/company'
import { Company } from '@src/models/Company'
import {
  newTestClient,
  initDatabase,
  setupDatabase,
  cleanupDatabase
} from '@tests/utils'

jest.setTimeout(10000)
jest.mock('@src/services/session')

describe('company', () => {
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

  it('should provide company count', async () => {
    expect.assertions(1)
    const { data } = await query({
      query: gql`
        {
          companyCount
        }
      `
    })
    expect(data?.companyCount).toEqual(companies.length)
  })

  it('should return one company based on id', async () => {
    expect.assertions(1)
    const testCompany = await Company.query().first()
    const { data } = await query({
      query: gql`
        {
          company(id: "${testCompany.id}") {
            name
          }
        }
      `
    })
    expect(data?.company.name).toEqual(companies[0].name)
  })

  it('should return all companies', async () => {
    expect.assertions(1)
    const { data } = await query({
      query: gql`
        {
          companies {
            id
          }
        }
      `
    })
    expect(data?.companies.length).toEqual(companies.length)
  })

  it('should filter companies', async () => {
    expect.assertions(1)
    const { data } = await query({
      query: gql`
        {
          companies(query: "${companies[0].name.slice(0, -1)}") {
            name
          }
        }
      `
    })
    expect(data?.companies[0]?.name).toEqual(companies[0].name)
  })

  it('should create a company', async () => {
    expect.assertions(2)
    const { data } = await mutate({
      mutation: gql`
        mutation {
          createCompany(data: { name: "a", alias: "a" }) {
            name
            alias
          }
        }
      `
    })
    expect(data?.createCompany).toEqual({ name: 'a', alias: 'a' })
    const findCompany = await Company.query().findOne({ name: 'a' })
    expect(findCompany).toBeDefined()
  })

  it('should delete a company', async () => {
    expect.assertions(2)
    // Temporary create one that will be deleted since existing ones are constrained
    const testCompany = await Company.query().insert({
      name: 'test',
      alias: 'test'
    })
    const { data } = await mutate({
      mutation: gql`
        mutation {
          deleteCompany(id: "${testCompany.id}")
        }
      `
    })
    expect(data?.deleteCompany).toEqual(true)
    const findCompany = await Company.query().findOne({ id: testCompany.id })
    expect(findCompany).toBeUndefined()
  })
})
