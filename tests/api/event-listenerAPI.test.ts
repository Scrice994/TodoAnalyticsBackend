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

    const eventListenerUrl = 'http://localhost:5005/eventListener'

    it("should return statusCode 400 and errorMessage if it recived a event not in the right format", async () => {
        const notEvent = await axios.post(eventListenerUrl, { event: { 
            type: 'genericEvent',
            data: {
                text: 'testText',
            }
        }}).catch(res => {
            expect(res.response.status).toBe(400)
            expect(res.response.data).toEqual({ message: 'Event recived is not in the right format'})
        })
        
        expect(notEvent?.status).toBe(undefined)
    })

    it("should return statusCode 500 when an error occour while finding group in the db", async () => {
        const requestWithWrongTenantId = await axios.post(eventListenerUrl, { 
            type: 'newTodo',
            data: {
                text: 'testText',
                completed: false,
                tenantId: { newTenantId: {}}
            }
        }).catch( res => {
            expect(res.response.status).toBe(500)
        })

        expect(requestWithWrongTenantId?.status).toBe(undefined)
    })

    it("should return statusCode 404 and errorMessage when tenantId is missing", async () => {
        const event = await axios.post(eventListenerUrl, { 
            type: 'newTodo',
            data: {
                text: 'testText',
                completed: false,
                id: 'testId'
            }
        }).catch(res => {
            expect(res.response.status).toBe(404)
            expect(res.response.data).toEqual({ message: 'Missing @parameter tenantId' })
        })

        expect(event?.status).toBe(undefined)
    })

    it("should return statusCode 404 and erroMessage when an unknown event is recived", async () => {
        const event = await axios.post(eventListenerUrl, { 
            type: 'genericEvent',
            data: {
                text: 'testText',
                completed: false,
                tenantId: 'testTenantId',
                id: 'testId'
            }
        }).catch(err => {
            expect(err.response.status).toBe(404)
            expect(err.response.data).toEqual({ message: 'Invalid @event recived' })
        })

        expect(event?.status).toBe(undefined)
    })

    describe("Event: newTodo", () => {
        it("Should increase todos by 1 when recive a newTodo event", async () => {
            const event = await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

    
            expect(event.data).toEqual({ response: { tenantId: 'testTenantId', todos: 1, completedTodos: 0, id: event.data.response.id } })
        })
    
        it("Should increase by 2 todos when recive 2 newTodo events", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })
    
            const secondEvent = await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText2',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId2'
                }
            })
    
            expect(secondEvent.data).toEqual({ response: { ...secondEvent.data.response, todos: 2 } })
        })
    })

    describe("Event: updateTodo", () => {
        it("should increase completedTodos when an event with a completed todo true is recived", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })
    
            const secondEvent = await axios.post(eventListenerUrl, { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }) 
    
            expect(secondEvent.status).toBe(200)
            expect(secondEvent.data).toEqual({ response: { ...secondEvent.data.response, completedTodos: 1 }})
        })
    
        it("should descrease completedTodos when an event with a todo compleated false is recived", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })
    
            const secondEvent = await axios.post(eventListenerUrl, { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }) 
            
            const thirdEvent = await axios.post(eventListenerUrl, { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }) 
    
            expect(thirdEvent.status).toBe(200)
            expect(thirdEvent.data).toEqual({ response: { ...thirdEvent.data.response, completedTodos: 0 } })
        })
    })

    describe("Event: deleteTodo", () => {
        it("Should descrease Todos by 1 when recived a deletedTodo event", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            const secondEvent = await axios.post(eventListenerUrl, { 
                type: 'deleteTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            expect(secondEvent.status).toBe(200)
            expect(secondEvent.data).toEqual({ response: { ...secondEvent.data.response, todos: 0 } })
        })

        it("Should descrease also completedTodos if the deleted Todo was completed", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            await axios.post(eventListenerUrl, { 
                type: 'updateTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            const thirdEvent = await axios.post(eventListenerUrl, { 
                type: 'deleteTodo',
                data: {
                    text: 'testText',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            }) 
            
            expect(thirdEvent.status).toBe(200)
            expect(thirdEvent.data).toEqual({ response: { ...thirdEvent.data.response, todos: 0, completedTodos: 0 }})
        })
    })

    describe("Event: deleteAllTodos", () => {
        it("Should descrease todos and completedTodos from the group read model", async () => {
            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            await axios.post(eventListenerUrl, { 
                type: 'newTodo',
                data: {
                    text: 'testText',
                    completed: false,
                    tenantId: 'testTenantId',
                    id: 'testId'
                }
            })

            const thirdEvent = await axios.post(eventListenerUrl, {
                type: 'updateTodo',
                data: {
                    text: 'testText2',
                    completed: true,
                    userId: 'testUserId',
                    tenantId: 'testTenantId',
                    id: 'testId2'
                }
            })

            const deleteAllTodosEvent = await axios.post(eventListenerUrl, { 
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
            })

            expect(deleteAllTodosEvent.data).toEqual({ response: { ...deleteAllTodosEvent.data.response, todos: 0, completedTodos: 0 } })
        })
    })
})