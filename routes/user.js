import express from "express";

import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";
import { adminToken, buyerToken, supplierToken, userToken } from "../middleware/authToken.js";

const router = express.Router();

router
  .get("/", getUsers)
  .get("/:id", getUser)
  .put("/:id", updateUser)
  .delete("/:id", deleteUser);

export default router;
