import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { GroupReadModel, Group } from "../entities/mongo/groupReadModelSchema";
import { UserReadModel, User } from "../entities/mongo/userReadModelSchema";
import { NewTodoEvent, TodoEventTypes } from "./events";

const USER_DATA_STORAGE = new MongoDataStorage<Group>(UserReadModel);
const GROUP_DATA_STORAGE = new MongoDataStorage<User>(GroupReadModel);

export const todoEventHandler = async (data: NewTodoEvent) => {
    const eventType = data.eventType;
    const event = data.event;

    switch (eventType) {
        case TodoEventTypes.Create: {
            const findUser = await USER_DATA_STORAGE.findOneByKey({ userId: event.userId });
            console.log(findUser);
            if(findUser){
                await USER_DATA_STORAGE.update({ id: findUser.id, todos: findUser.todos + 1 })
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: findUser.tenantId });
                if(findGroup){
                    await GROUP_DATA_STORAGE.update({ id: findGroup.id, todos: findGroup.todos + 1 });
                }
            }
            break;
        }
        case TodoEventTypes.Toggle: {
            const findUser = await USER_DATA_STORAGE.findOneByKey({ userId: event.userId });
            console.log(findUser);
            if(findUser){
                if(event.completed === true){
                    await USER_DATA_STORAGE.update({ id: findUser.id, completedTodos: findUser.completedTodos + 1 })
                } else {
                    await USER_DATA_STORAGE.update({ id: findUser.id, completedTodos: findUser.completedTodos - 1 })
                }
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: findUser.tenantId });
                if(findGroup){
                    if(event.completed === true){
                        await GROUP_DATA_STORAGE.update({ id: findGroup.id, completedTodos: findGroup.completedTodos + 1 })
                    } else {
                        await GROUP_DATA_STORAGE.update({ id: findGroup.id, completedTodos: findGroup.completedTodos - 1 })
                    }
                }
            }
            break;
        }
        case TodoEventTypes.Delete: {
            const findUser = await USER_DATA_STORAGE.findOneByKey({ userId: event.userId });
            if(findUser){
                if(event.completed === true){
                    await USER_DATA_STORAGE.update({ id: findUser.id, todos: findUser.todos - 1,  completedTodos: findUser.completedTodos - 1 })
                } else {
                    await USER_DATA_STORAGE.update({ id: findUser.id, todos: findUser.todos - 1 });
                }
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: findUser.tenantId });
                if(findGroup){
                    if(event.completed === true){
                        await GROUP_DATA_STORAGE.update({ id: findGroup.id, todos: findGroup.todos - 1, completedTodos: findGroup.completedTodos - 1 });
                    } else {
                        await GROUP_DATA_STORAGE.update({ id: findGroup.id, todos: findGroup.todos - 1 });
                    }
                }
            }
            break;
        }
        case TodoEventTypes.DeleteAll: {
            const findUser = await USER_DATA_STORAGE.findOneByKey({ userId: event.userId });
            if(findUser){
                await USER_DATA_STORAGE.update({ id: findUser.id, todos: 0, completedTodos: 0 });
            }
            if(findUser.tenantId){
                const findGroup = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: findUser.tenantId });
                if(findGroup){
                    await GROUP_DATA_STORAGE.update({ id: findGroup.id, todos: findGroup.todos - findUser.todos, completedTodos: findGroup.completedTodos - findUser.completedTodos });
                }
            }
            break;
        }
        default:
            console.log("Invalid EventType")
            break;
    }
}