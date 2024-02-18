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

export const userEventHandler = async (data: any) => {

    const eventType = data.eventType;
    const event = data.event;

    switch (eventType) {
        case "user_login": {
            const findExistingUserModel = await USER_READ_CRUD.readOne({ userId: event.userId });
            if(!findExistingUserModel){
                await USER_READ_CRUD.create({
                    username: event.username,
                    userId: event.userId,
                    tenantId: event.tenantId
                });
            }
            const findExistingGroupModel = await GROUP_READ_CRUD.readOne({ tenantId: event.tenantId });
            if(!findExistingGroupModel){
                await GROUP_READ_CRUD.create({
                    tenantId: event.tenantId
                });
            }
            break;
        }
        default:
            console.log("Invalid EventType")
            break;
    }
}