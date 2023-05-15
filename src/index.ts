import cors from 'cors'
import express from 'express'
import { GroupCRUD } from './crud/groupCRUD'
import { UserCRUD } from './crud/userCRUD'
import { MongoDataStorage } from './dataStorage/MongoDataStorage'
import { GroupReadModelEntity } from './entities/GroupReadModelEntity'
import { UserReadModelEntity } from './entities/UserReadModelEntity'
import { GroupReadModel } from './entities/mongo/groupReadModelSchema'
import { UserReadModel } from './entities/mongo/userReadModelSchema'
import { GroupRepository } from './repositories/groupRepository'
import { UserRepository } from './repositories/userRepository'
import { EventHandler } from './utils/EventHandler/EventHandler'
import { connectDatabase } from './utils/connectDatabase'

const app = express()

app.use(express.json())
app.use(cors())

const USER_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel)
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE)
const USER_CRUD = new UserCRUD(USER_REPOSITORY)
const GROUP_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel)
const GROUP_REPOSITORY = new GroupRepository(GROUP_DATA_STORAGE)
const GROUP_CRUD = new GroupCRUD(GROUP_REPOSITORY)

app.post('/user/signup', async (req, res) => {
    res.status(200).json({message: 'not implemented yet'})
})

app.post('/event-listener', async (req, res) => {
    const newEvent = req.body

    const { userId, tenantId, ...data } = newEvent.event.data

    let user: UserReadModelEntity | null = null;
    let group: GroupReadModelEntity | null = null;

    const findUser = await USER_CRUD.readOne({ userId })
    const findGroup = await GROUP_CRUD.readOne({ tenantId })

    if('response' in findUser.data){
        user = findUser.data.response

        if(findUser.data.response === null){
            const newUserReadModel = await USER_CRUD.create({ userId })
            if('response' in newUserReadModel.data){
                user = newUserReadModel.data.response
            }
        } 
    }

    if('response' in findGroup.data){
        group = findGroup.data.response

        if(findGroup.data.response === null){
            const newGroupReadModel = await GROUP_CRUD.create({ tenantId })
            if('response' in newGroupReadModel.data){
                group = newGroupReadModel.data.response
            }
        } 
    }

    const eventHandler = new EventHandler(USER_CRUD, GROUP_CRUD, user, group)

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
