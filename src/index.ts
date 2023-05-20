import cors from 'cors'
import express from 'express'
import { GroupReadModelCRUD } from './crud/groupReadModelCRUD'
import { UserReadModelCRUD } from './crud/userReadModelCRUD'
import { MongoDataStorage } from './dataStorage/MongoDataStorage'
import { GroupReadModelEntity } from './entities/GroupReadModelEntity'
import { UserReadModelEntity } from './entities/UserReadModelEntity'
import { GroupReadModel } from './entities/mongo/groupReadModelSchema'
import { UserReadModel } from './entities/mongo/userReadModelSchema'
import { GroupReadModelRepository } from './repositories/groupReadModelRepository'
import { UserReadModelRepository } from './repositories/userReadModelRepository'
import { EventHandler } from './utils/EventHandler/EventHandler'
import { connectDatabase } from './utils/connectDatabase'
import { ValidCredentials } from './utils/ValidCredentials/ValidCredentials'
import { UserCRUD } from './crud/userCRUD'
import { UserEntity } from './entities/UserEntity'
import { User } from './entities/mongo/userSchema'
import { UserRepository } from './repositories/userRepository'
import { ICRUDResponse } from './crud/ICRUD'
import { PasswordHandler } from './utils/cryptPassword/PasswordHandler'
import { CryptoPasswordHandler } from './utils/cryptPassword/CryptoPasswordHandler'
import * as uuid from 'uuid'
import { JWTHandler } from './utils/tokenHandler/JWTHandler'
import { JsonWebTokenPkg } from './utils/tokenHandler/JsonWebTokenPkg'

const app = express()

app.use(express.json())
app.use(cors())

const USER_READ_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel)
const USER_READ_REPOSITORY = new UserReadModelRepository(USER_READ_DATA_STORAGE)
const USER_READ_CRUD = new UserReadModelCRUD(USER_READ_REPOSITORY)
const GROUP_READ_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel)
const GROUP_READ_REPOSITORY = new GroupReadModelRepository(GROUP_READ_DATA_STORAGE)
const GROUP_READ_CRUD = new GroupReadModelCRUD(GROUP_READ_REPOSITORY)
const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(User)
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE)
const USER_CRUD = new UserCRUD(USER_REPOSITORY)
const secret = "ahfiokwplagjobawoipèaclrljbapfoej"

app.post('/user/signup', async (req, res) => {
    const { username, password, confirmPassword, groupName } = req.body


    if(!username){
        return res.status(400).json({ message: "Username is required" })
    }
    if(!password){
        return res.status(400).json({ message: "Password is required" })
    }
    if(!confirmPassword){
        return res.status(400).json({ message: "Confirm password is required" })
    }

    if(password !== confirmPassword){
        return res.status(400).json({ message: "Password & confirm password do not match" })
    }

    const credentials = new ValidCredentials(username, password)

    const validUsername = credentials.usernameCheck()
    const validPassword = credentials.passwordCheck()

    if(!validUsername){
        return res.status(400).json({ message: "Username must have only alphanumeric chars and be 4-20 length" })
    }
    if(!validPassword){
        return res.status(400).json({ message: "Password must be at least 6 length, and have at least 1 number and 1 letter"})
    }

    const findExistingUser = await USER_CRUD.readOne({ username })
    if('response' in findExistingUser.data && findExistingUser.data.response !== null){
        return res.status(400).json({ message: "This user already exist" })
    }

    const findExistingGroup = await USER_CRUD.readOne({ tenantId: groupName })
    console.log(findExistingGroup)
    if('response' in findExistingGroup.data && findExistingGroup.data.response !== null){
        return res.status(400).json({ message: "This group name already exist"})
    }

    const cryptoObj = new PasswordHandler(new CryptoPasswordHandler()).cryptPassword(password)

    let newUser: ICRUDResponse<UserEntity>;

    if(groupName){
        newUser = await USER_CRUD.create({
            username: username,
            password: cryptoObj.hashPassword,
            salt: cryptoObj.salt,
            userRole: 'Admin',
            tenantId: groupName
        })
    } else {
        newUser = await USER_CRUD.create({
            username: username,
            password: cryptoObj.hashPassword,
            salt: cryptoObj.salt,
            userRole: 'Admin'
        })
    }

    if('response' in newUser.data){
        const user = newUser.data.response

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires})

    } else {
        return res.status(400).json({ message: "Error while trying to create user"})
    }
})

app.post('/event-listener', async (req, res) => {
    const newEvent = req.body

    const { userId, tenantId, ...data } = newEvent.event.data

    let user: UserReadModelEntity | null = null;
    let group: GroupReadModelEntity | null = null;

    const findUser = await USER_READ_CRUD.readOne({ userId })
    const findGroup = await GROUP_READ_CRUD.readOne({ tenantId })

    if('response' in findUser.data){
        user = findUser.data.response

        if(findUser.data.response === null){
            const newUserReadModel = await USER_READ_CRUD.create({ userId })
            if('response' in newUserReadModel.data){
                user = newUserReadModel.data.response
            }
        } 
    }

    if('response' in findGroup.data){
        group = findGroup.data.response

        if(findGroup.data.response === null){
            const newGroupReadModel = await GROUP_READ_CRUD.create({ tenantId })
            if('response' in newGroupReadModel.data){
                group = newGroupReadModel.data.response
            }
        } 
    }

    const eventHandler = new EventHandler(USER_READ_CRUD, GROUP_READ_CRUD, user, group)

    switch(newEvent.event.type){
        case 'newTodo': {
            const result = await eventHandler.newTodoHandler(userId, tenantId)
            user = result.user
            group = result.group
            break;
        }
        case 'updateTodo': {
            const result = await eventHandler.updateTodoHandler(userId, tenantId, data)
            user = result.user
            group = result.group
            break;
        }
        case 'deleteTodo': {
            const result = await eventHandler.deleteTodoHandler(userId, tenantId, data)
            user = result.user
            group = result.group
            break;
        }
        case 'deleteAllTodos': {
            const result = await eventHandler.deleteAllTodosHandler(userId, tenantId, data)
            user = result.user
            group = result.group
            break;
        }
    }

    return res.status(200).json({ Entities: { User: user, Group: group } })
})

connectDatabase().then(() => {
    app.listen(5005, () => {
        console.log('Listening on port: 5005')
    })
})
