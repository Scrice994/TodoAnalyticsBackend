import express from "express";
import * as Controllers from "../controllers/controllers";

const router = express.Router();

router.get("/get-group/:tenantId", Controllers.getGroupModel);
router.get("/get-user/:userId", Controllers.getUserModel);

export default router;