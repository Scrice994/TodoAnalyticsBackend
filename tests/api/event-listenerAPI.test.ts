import axios from 'axios'
import { clearDatabase, databaseConnection, closeDatabaseConnection } from './utils/mongooseTestUtils'

describe("event-listenerAPI", () => {

    beforeAll( async () => {
        await databaseConnection()
    })

    beforeEach( async () => {
        await clearDatabase()
    })

    afterAll( async () => {
        await closeDatabaseConnection()
    })

    describe("Event: genericEvent", () => {
        it("Should return a Entities obj with a model for user and a group model equal null", async () => {
            const result = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'genericEvent',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId'
                }
            }})
    
            expect(result.status).toBe(200)
            expect(result.data.Entities).toEqual({
                    User: {
                        userId: 'testUserId',
                        todos: 0,
                        completedTodos: 0,
                        id: result.data.Entities.User.id
                    },
                    Group: null
            })
        })
    
        it("Should return a Entities obj with a model for user and one for group", async () => {
            const result = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'genericEvent',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})
    
            expect(result.status).toBe(200)
            expect(result.data).toEqual({ Entities: {
                    User: {
                        userId: 'testUserId',
                        todos: 0,
                        completedTodos: 0,
                        id: result.data.Entities.User.id
                    },
                    Group: {
                        tenantId: 'testTenantId',
                        todos: 0,
                        completedTodos: 0,
                        id: result.data.Entities.Group.id 
                    }
                }
            })
        })
    })

    describe("Event: newTodo", () => {
        it("Should increase todos by 1 when recive a newTodo event", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId'
                }
            }})
    
            expect(firstEvent.data.Entities.User).toEqual({ ...firstEvent.data.Entities.User, todos: 1 })
        })
    
        it("Should increase by 2 todos when recive 2 newTodo events", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId'
                }
            }})

            console.log(firstEvent.data)
    
            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText2',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId2'
                }
            }})

            console.log(secondEvent.data)
    
            expect(secondEvent.data.Entities.User).toEqual({ ...secondEvent.data.Entities.User, todos: 2 })
        })
    })

    describe("Event: updateTodo", () => {
        it("should increase completedTodos when an event with a completed todo true is recived", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})
    
            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }}) 
    
            expect(secondEvent.status).toBe(200)
            expect(secondEvent.data.Entities.User).toEqual({ ...secondEvent.data.Entities.User, completedTodos: 1 })
            expect(secondEvent.data.Entities.Group).toEqual({ ...secondEvent.data.Entities.Group, completedTodos: 1 })
        })
    
        it("should descrease completedTodos when an event with a todo compleated false is recived", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})
    
            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})
            
            const thirdEvent = await axios.post('http://localhost:5005/event-listener', { event: {
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})
    
            expect(thirdEvent.status).toBe(200)
            expect(thirdEvent.data.Entities.User).toEqual({ ...thirdEvent.data.Entities.User, completedTodos: 0 })
            expect(thirdEvent.data.Entities.Group).toEqual({ ...thirdEvent.data.Entities.Group, completedTodos: 0 })
        })
    })

    describe("Event: deleteTodo", () => {
        it("Should descrease Todos by 1 when recived a deletedTodo event", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})

            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'deleteTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})

            expect(secondEvent.status).toBe(200)
            expect(secondEvent.data.Entities.User).toEqual({ ...secondEvent.data.Entities.User, todos: 0 })
        })

        it("Should descrease also completedTodos if the deleted Todo was completed", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})

            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})

            const thirdEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'deleteTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }}) 
            
            expect(thirdEvent.status).toBe(200)
            expect(thirdEvent.data.Entities.User).toEqual({ ...thirdEvent.data.Entities.User, todos: 0, completedTodos: 0 })
            expect(thirdEvent.data.Entities.Group).toEqual({ ...thirdEvent.data.Entities.Group, todos: 0, completedTodos: 0 })
        })
    })

    describe("Event: deleteAllTodos", () => {
        it("Should reset todos and completedTodos in case of single User", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId'
                }
            }})

            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText2',
                    completed: false,
                    userId: 'testUserId',
                    id: 'testId2'
                }
            }})

            const deleteAllTodosEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'deleteAllTodos',
                data: { 
                    deletedTodos: [{
                    text: 'testText2',
                    completed: false,
                    id: 'testId2'
                    },
                    {
                        text: 'testText',
                        completed: false,
                        userId: 'testUserId',
                        id: 'testId'
                    }],
                    userId: 'testUserId'
                }
            }})

            expect(deleteAllTodosEvent.data.Entities.User).toEqual({ ...deleteAllTodosEvent.data.Entities.User, todos: 0, completedTodos: 0 })
        })

        it("Should descrease todos and completedTodos from the group read model", async () => {
            const firstEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }})

            const secondEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'newTodo',
                data: {
                    text: 'testText2',
                    completed: false,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId2'
                }
            }})

            const thirdEvent = await axios.post('http://localhost:5005/event-listener', { event: {
                type: 'updateTodo',
                data: {
                    text: 'testText2',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId2'
                }
            }})

            const deleteAllTodosEvent = await axios.post('http://localhost:5005/event-listener', { event: { 
                type: 'deleteAllTodos',
                data: { 
                    deletedTodos: [{
                    text: 'testText2',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId2'
                    },
                    {
                        text: 'testText',
                        completed: true,
                        userId: 'testUserId',
                        tenantId: 'testTenantId',
                        id: 'testId'
                    }],
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                }
            }})

            expect(deleteAllTodosEvent.data.Entities.Group).toEqual({ ...deleteAllTodosEvent.data.Entities.Group, todos: 0, completedTodos: 0 })
        })
    })
})