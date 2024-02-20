import { RequestHandler } from "express";
import { GroupReadModelCRUD } from "../crud/groupReadModelCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { GroupReadModel } from "../entities/mongo/groupReadModelSchema";
import { GroupReadModelRepository } from "../repositories/groupReadModelRepository";
import { GroupReadModelEntity, UserReadModelEntity } from "../entities/Entities";
import { UserReadModelRepository } from "../repositories/userReadModelRepository";
import { UserReadModelCRUD } from "../crud/userReadModelCRUD";

const GROUP_READ_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel);
const GROUP_READ_REPOSITORY = new GroupReadModelRepository(GROUP_READ_DATA_STORAGE);
const GROUP_READ_CRUD = new GroupReadModelCRUD(GROUP_READ_REPOSITORY);
const USER_READ_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(GroupReadModel);
const USER_READ_REPOSITORY = new UserReadModelRepository(USER_READ_DATA_STORAGE);
const USER_READ_CRUD = new UserReadModelCRUD(USER_READ_REPOSITORY);

export const getGroupModel: RequestHandler = async (req, res, next) => {
    const { tenantId } = req.params;
    const readModel = await GROUP_READ_CRUD.readOne({ tenantId });

    return res.status(200).json(readModel);
};

export const getUserModel: RequestHandler = async (req, res, next) => {
    const { userId } = req.params;
    const readModel = await USER_READ_CRUD.readOne({ userId });

    return res.status(200).json();
}