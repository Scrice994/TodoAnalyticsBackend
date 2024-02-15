import express from "express";
import * as Controllers from "../controllers/controllers";

const router = express.Router();

router.get("/:tenantId", Controllers.getGroupModel);

export default router;