import { GroupReadModelCRUD } from "../crud/groupReadModelCRUD";
import { GroupReadModelEntity, GroupReadModel } from "../entities/mongo/groupReadModelSchema";
import { GroupReadModelRepository } from "../repositories/groupReadModelRepository";
import { UserReadModelCRUD } from "../crud/userReadModelCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { UserReadModel, UserReadModelEntity } from "../entities/mongo/userReadModelSchema";
import { UserReadModelRepository } from "../repositories/userReadModelRepository";

const USER_READ_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel);
const USER_READ_REPOSITORY = new UserReadModelRepository(USER_READ_DATA_STORAGE);
const USER_READ_CRUD = new UserReadModelCRUD(USER_READ_REPOSITORY);
const GROUP_READ_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel);
const GROUP_READ_REPOSITORY = new GroupReadModelRepository(GROUP_READ_DATA_STORAGE);
const GROUP_READ_CRUD = new GroupReadModelCRUD(GROUP_READ_REPOSITORY);

export const todoEventHandler = async (data: any) => {
    const eventType = data.eventType;
    const event = data.event;

    switch (eventType) {
        case "todo_create": {
            const findUser = await USER_READ_CRUD.readOne({ userId: event.userId });
            console.log(findUser);
            if(findUser){
                await USER_READ_CRUD.update({ id: findUser.id, todos: findUser.todos! + 1 })
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_READ_CRUD.readOne({ tenantId: findUser.tenantId });
                if(findGroup){
                    await GROUP_READ_CRUD.update({ id: findGroup.id, todos: findGroup.todos! + 1 });
                }
            }
            break;
        }
        case "todo_toggle": {
            const findUser = await USER_READ_CRUD.readOne({ userId: event.userId });
            if(findUser){
                if(event.completed === true){
                    await USER_READ_CRUD.update({ id: findUser.id, completedTodos: findUser.completedTodos! + 1 })
                } else {
                    await USER_READ_CRUD.update({ id: findUser.id, completedTodos: findUser.completedTodos! - 1 })
                }
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_READ_CRUD.readOne({ tenantId: findUser.tenantId });
                if(findGroup){
                    if(event.completed === true){
                        await GROUP_READ_CRUD.update({ id: findGroup.id, completedTodos: findGroup.completedTodos! + 1 })
                    } else {
                        await GROUP_READ_CRUD.update({ id: findGroup.id, completedTodos: findGroup.completedTodos! - 1 })
                    }
                }
            }
            break;
        }
        case "todo_delete": {
            const findUser = await USER_READ_CRUD.readOne({ userId: event.userId });
            if(findUser){
                if(event.completed === true){
                    await USER_READ_CRUD.update({ id: findUser.id, todos: findUser.todos! - 1, completedTodos: findUser.completedTodos! - 1 })
                } else {
                    await USER_READ_CRUD.update({ id: findUser.id, todos: findUser.todos! - 1 });
                }
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_READ_CRUD.readOne({ tenantId: findUser.tenantId });
                if(findGroup){
                    if(event.completed === true){
                        await GROUP_READ_CRUD.update({ id: findGroup.id, todos: findGroup.todos! - 1, completedTodos: findGroup.completedTodos! - 1 });
                    } else {
                        await GROUP_READ_CRUD.update({ id: findGroup.id, todos: findGroup.todos! - 1 });
                    }
                }
            }
            break;
        }
        case "todo_deleteAll": {
            const findUser = await USER_READ_CRUD.readOne({ userId: event.userId });
            if(findUser){
                await USER_READ_CRUD.update({ id: findUser.id, todos: 0, completedTodos: 0 });
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_READ_CRUD.readOne({ tenantId: findUser.tenantId });
                if(findGroup){
                    await GROUP_READ_CRUD.update({ id: findGroup.id, todos: findGroup.todos! - findUser.todos!, completedTodos: findGroup.completedTodos! - findUser.completedTodos! });
                }
            }
            break;
        }
        default:
            console.log("Invalid EventType")
            break;
    }
}