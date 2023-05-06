import { GroupCRUD } from "../../../src/crud/groupCRUD"
import { RepositoryMock } from "../../__mocks__/repository.mock"

describe("GroupCRUD", () => {

    const REPOSITORY = new RepositoryMock()
    const CRUD = new GroupCRUD(REPOSITORY)

    describe("readOne()", () => {
        it("should call getOneByKey() from the repository and return an obj with statusCode 200 and a response", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1      
            }))

            const result = await CRUD.readOne({ tenantId: 'testTenantId' })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1      
            }})
        })

        it("should return statusCode 500 and return ErrorMessage when an error occour", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => {throw new Error('TestError')})

            const result = await CRUD.readOne({ tenantId: 'testTenantId' })

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })

    describe("create()", () => {
        it("should call insertOne() from the repository and return an obj with statusCode 200 and a response", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1    
            }))

            const result = await CRUD.create({
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1    
            })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1   
            }})
        })

        it("should return an obj with statusCode 500 and a ErrorMessage when an error occour", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => { throw new Error('TestError') })

            const result = await CRUD.create({
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1     
            })
            
            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })

    describe("update()", () => {
        it("should call updateOne() from the repository and return an obj with statusCode 200 and a response", async () => {
            REPOSITORY.updateOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1   
            }))

            const result = await CRUD.update({ tenantId: 'testTenantId' }, { completedTodos: 1 })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1   
            }})
        })

        
        it("should return an obj with statusCode 500 and an errorMessage when an error occour", async () => {
            REPOSITORY.updateOne.mockImplementationOnce(() => { throw new Error('TestError') })

            const result = await CRUD.update({ tenantId: 'testTenantId' }, { completedTodos: 2})

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })
})