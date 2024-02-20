import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { GroupReadModel } from "../entities/mongo/groupReadModelSchema";
import { UserReadModel } from "../entities/mongo/userReadModelSchema";
import { GroupReadModelEntity, UserReadModelEntity } from "../entities/Entities";
import { NewUserEvent, UserEventTypes } from "./events";

const USER_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel);
const GROUP_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel);

export const userEventHandler = async (data: NewUserEvent) => {

    const eventType = data.eventType;
    const event = data.event;

    switch (eventType) {
        case UserEventTypes.Login: {
            const findExistingUserModel = await USER_DATA_STORAGE.findOneByKey({ userId: event.userId });
            if(!findExistingUserModel){
                await USER_DATA_STORAGE.create({
                    username: event.username,
                    userId: event.userId,
                    tenantId: event.tenantId
                });
            }
            if(event.tenantId){
                const findExistingGroupModel = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: event.tenantId });
                if(!findExistingGroupModel){
                    await GROUP_DATA_STORAGE.create({
                        tenantId: event.tenantId
                    });
                }
            }
            break;
        }
        default:
            console.log("Invalid EventType")
            break;
    }
}