import { GroupReadModelCRUD } from "../crud/groupReadModelCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { GroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { GroupReadModel } from "../entities/mongo/groupReadModelSchema";
import { GroupReadModelRepository } from "../repositories/groupReadModelRepository";

const GROUP_READ_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel);
const GROUP_READ_REPOSITORY = new GroupReadModelRepository(GROUP_READ_DATA_STORAGE);
const GROUP_READ_CRUD = new GroupReadModelCRUD(GROUP_READ_REPOSITORY);

export const getGroupModel = async (req, res, next) => {
    const { tenantId } = req.params;
    const readModel = await GROUP_READ_CRUD.readOne({ tenantId });

    return res.status(200).json(readModel);
};