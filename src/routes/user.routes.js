import { Router } from "express";
import {
    getUsers,
  createUsers
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUsers);

export default router;
