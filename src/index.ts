import axios from 'axios'
import cors from 'cors'
import express from 'express'
import { GroupReadModelCRUD } from './crud/groupReadModelCRUD'
import { UserCRUD } from './crud/userCRUD'
import { MongoDataStorage } from './dataStorage/MongoDataStorage'
import { GroupReadModelEntity } from './entities/GroupReadModelEntity'
import { UserEntity } from './entities/UserEntity'
import { GroupReadModel } from './entities/mongo/groupReadModelSchema'
import { User } from './entities/mongo/userSchema'
import { GroupReadModelRepository } from './repositories/groupReadModelRepository'
import { UserRepository } from './repositories/userRepository'
import { connectDatabase } from './utils/connectDatabase'
import { CryptoPasswordHandler } from './utils/cryptPassword/CryptoPasswordHandler'
import { PasswordHandler } from './utils/cryptPassword/PasswordHandler'
import { JWTHandler } from './utils/tokenHandler/JWTHandler'
import { JsonWebTokenPkg } from './utils/tokenHandler/JsonWebTokenPkg'

const app = express()

app.use(express.json())
app.use(cors())

const GROUP_READ_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel)
const GROUP_READ_REPOSITORY = new GroupReadModelRepository(GROUP_READ_DATA_STORAGE)
const GROUP_READ_CRUD = new GroupReadModelCRUD(GROUP_READ_REPOSITORY)
const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(User)
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE)
const USER_CRUD = new UserCRUD(USER_REPOSITORY)
const secret = "ahfiokwplagjobawoipèaclrljbapfoej"

app.post('/user/signup', async (req, res) => {
    const { username, password, groupName } = req.body

    const findExistingUser = await USER_CRUD.readOne({ username })
    if('response' in findExistingUser.data && findExistingUser.data.response !== null){
        return res.status(400).json({ message: "This user already exist" })
    }

    const findExistingGroup = await USER_CRUD.readOne({ tenantId: groupName })
    console.log(findExistingGroup)
    if('response' in findExistingGroup.data && findExistingGroup.data.response !== null){
        return res.status(400).json({ message: "This group name already exist"})
    }

    const newUser = await USER_CRUD.create({
        username: username,
        password: password,
        userRole: 'Admin',
        tenantId: groupName
    })

    if('response' in newUser.data){
        const user = newUser.data.response

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires})
    }
        
    return res.status(newUser.statusCode).json(newUser.data)
})

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body
    
    const userInDb = await USER_CRUD.readOne({username: username})


    if('response' in userInDb.data && userInDb.data.response !== null){
       const user = userInDb.data.response

       const passwordVerification = new PasswordHandler(new CryptoPasswordHandler()).checkPassword(password, user.password, user.salt)

        if(!passwordVerification){
            return res.status(401).json({ message: "Wrong credentials" })
        }

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires })
    }

    return res.status(401).json({ message: "Wrong credentials" })
})

app.post('/eventListener', async (req, res) => {
    const newEvent = req.body
    console.log('evento: ', newEvent)


    if(!newEvent.data || !newEvent.type){
        return res.status(400).json({ message: 'Event recived is not in the right format' })
    }

    const { userId, tenantId, ...data } = newEvent.data

    const findGroup = await GROUP_READ_CRUD.readOne({ tenantId })

    console.log(findGroup)

    if('response' in findGroup.data){

        if(findGroup.data.response === null){
            const newGroupReadModel = await GROUP_READ_CRUD.create({ tenantId })

            if('response' in newGroupReadModel.data){
                const updateReadModel = await GROUP_READ_CRUD.update(newGroupReadModel.data.response, newEvent)
                return res.status(updateReadModel.statusCode).json(updateReadModel.data)
            }
            return res.status(newGroupReadModel.statusCode).json(newGroupReadModel.data)
        } 

        const updateReadModel = await GROUP_READ_CRUD.update(findGroup.data.response, newEvent)
        return res.status(updateReadModel.statusCode).json(updateReadModel.data)
    }

    return res.status(findGroup.statusCode).json(findGroup.data)
})

connectDatabase().then(() => {
    app.listen(5005, async () => {
        console.log('Listening on port: 5005...')
        await axios.post('http://localhost:4005/subscription', { url: 'http://localhost:5005/eventListener' }).then(() => {
            console.log('Subcribing to event bus...')
        }).catch(result => {
            console.log(result.response.data)
        })
    })
})
