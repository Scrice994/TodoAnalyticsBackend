import { GroupReadModelCRUD } from "../../../src/crud/groupReadModelCRUD"
import { RepositoryMock } from "../../__mocks__/repository.mock"

describe("GroupReadModelCRUD", () => {

    const REPOSITORY = new RepositoryMock()
    const CRUD = new GroupReadModelCRUD(REPOSITORY)

    describe("readOne()", () => {
        it("should call getOneByKey() from the repository", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1      
            }));

            const result = await CRUD.readOne({ tenantId: 'testTenantId' });

            expect(result).toEqual({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1      
            });
        });
    });

    describe("create()", () => {
        it("should call insertOne() from the repository", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1    
            }));

            const result = await CRUD.create({
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1    
            });

            expect(result).toEqual({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1   
            });
        });
    })

    describe("update()", () => {
        it("should call updateOne() from the repository", async () => {
            REPOSITORY.updateOne.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1    
            }));
        });
    });
})