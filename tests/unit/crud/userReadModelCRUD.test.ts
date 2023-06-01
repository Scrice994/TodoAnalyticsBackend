import { UserReadModelCRUD } from "../../../src/crud/userReadModelCRUD"
import { RepositoryMock } from "../../__mocks__/repository.mock"

describe("readModelCRUD()", () => {
    const REPOSITORY = new RepositoryMock()
    const CRUD = new UserReadModelCRUD(REPOSITORY)

    describe("create()", () => {
        it("should call insertOne() from a repository and return obj with statusCode 200 if no error occour", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }))


            const result = await CRUD.create({
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }})
        })

        it("should response statusCode 500 with errorMessage when an error occour", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => {throw new Error('TestError')})

            const result = await CRUD.create({ userId: 'testUserId', todos: 2, completedTodos: 1 })

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })

    describe("readOne()", () => {
        it("should call getOneByKey() from the repository and return obj with statusCode 200 if no error occour", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1      
            }))

            const result = await CRUD.readOne({ userId: 'testUserId' })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1      
            }})
        })

        it("should return obj with statusCode 500 if an error occour", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => { throw new Error('TestError')})

            const result = await CRUD.readOne({ userId: 'testUserId' })

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })

    describe("update()", () => {
        it("should call updateOne() in the repository and return 200 statusCode with response if no error occour", async () => {
            REPOSITORY.updateOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1     
            }))
    
            const result = await CRUD.update({ userId: 'testUserId'}, { todos: 2 })

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: {
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1  
            }})
        })

        it("should return 500 statusCode and errorMessage when an error occour", async () => {
            REPOSITORY.updateOne.mockImplementationOnce(() => {throw new Error('TestError')})

            const result = await CRUD.update({userId: 'testUserId'}, { todos: 3})

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })
})