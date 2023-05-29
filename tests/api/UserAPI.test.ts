import axios from 'axios'
import { clearDatabase, databaseConnection, closeDatabaseConnection } from './utils/mongooseTestUtils'

describe('UserAPI', () => {
    beforeAll( async () => {
        await databaseConnection()
    })

    beforeEach( async () => {
        await clearDatabase()
    })

    afterAll( async () => {
        await closeDatabaseConnection()
    })

    const REGISTER_URL = 'http://localhost:5005/user/signup'
    const LOGIN_URL = 'http://localhost:5005/user/login'

    describe('signup', () => {
        it("should return new created user with his token", async () => {
            const result = await axios.post(REGISTER_URL, {
                username: 'testUsername',
                password: 'testPassword1',
                confirmPassword: 'testPassword1',
                groupName: 'testGroupName'
            })
            
            expect(result.status).toBe(200)
            expect(result.data).toEqual({user: result.data.user, token: result.data.token, expireIn: result.data.expireIn })
        })
    
        it("Should return 400 statusCode and errorMessage if groupName already exist", async () => {
            await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
            const secondUser = await axios.post(REGISTER_URL, {username: 'fakeUser2', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({ message: "This group name already exist" })
                })
            expect(secondUser?.status).toBe(undefined)
        })
    
        it("Should return 400 statusCode and errorMessage if groupName already exist", async () => {
            await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
            const secondUser = await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Phantom troupe'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({ message: "This user already exist" })
                })
            expect(secondUser?.status).toBe(undefined)
        })
    
        it("Should return 404 statusCode and errorMessage if username is not provided", async () => {
            const createUser = await axios.post(REGISTER_URL, {username: '', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({ message: "Missing @parameter username" })
                })
            expect(createUser?.status).toBe(undefined)
        })
    
        it("Should return 404 statusCode and errorMessage if password is not provided", async () => {
            const createUser = await axios.post(REGISTER_URL, {username: 'testUsername', password: '', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({ message: "Missing @parameter password" })
                })
            expect(createUser?.status).toBe(undefined)
        })
    
        it("Should return 400 statusCode and errorMessage if username provided in invalid", async () => {
            const createUser = await axios.post(REGISTER_URL, {username: 'a', password: 'testPassword123', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({ message: "Invalid @parameter username" })
                })
            expect(createUser?.status).toBe(undefined)
        })
    
        it("Should return 400 statusCode and errorMessage if password provided is invalid", async () => {
            const createUser = await axios.post(REGISTER_URL, {username: 'testUsername', password: 'testPassword', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({ message: "Invalid @parameter password" })
                })
            expect(createUser?.status).toBe(undefined)
        })
    })

    describe('login', () => {
        it("Should return statusCode 401 and errorMessage if username in not found in db", async () => {
            const result = await axios.post(LOGIN_URL, { username: 'testUsername', password: 'testPassword123' }).catch(err => {
                expect(err.response.status).toBe(401)
                expect(err.response.data).toEqual({ message: 'Wrong credentials' })
            })

            expect(result?.status).toBe(undefined)
        })

        it("Should return statusCode 401 and errorMessage if username exist but password is invalid", async () => {
            await axios.post(REGISTER_URL, {
                username: 'testUsername',
                password: 'testPassword1',
                confirmPassword: 'testPassword1',
                groupName: 'testGroupName'
            })

            const result = await axios.post(LOGIN_URL, { username: 'testUsername', password: 'testPassword123' }).catch(err => {
                expect(err.response.status).toBe(401)
                expect(err.response.data).toEqual({ message: 'Wrong credentials' })
            })

            expect(result?.status).toBe(undefined)
        })

        it("Should return statusCode 200 with user and token obj", async () => {
            await axios.post(REGISTER_URL, {
                username: 'testUsername',
                password: 'testPassword1',
                confirmPassword: 'testPassword1',
                groupName: 'testGroupName'
            })

            const result = await axios.post(LOGIN_URL, { username: 'testUsername', password: 'testPassword1' })

            expect(result.status).toBe(200)
            expect(result.data).toEqual({
                user: { username: 'testUsername', tenantId: 'testGroupName', ...result.data.user },
                token: result.data.token,
                expireIn: result.data.expireIn
            })
        })
    })
})