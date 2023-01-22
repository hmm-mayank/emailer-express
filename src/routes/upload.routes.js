import { Router } from "express";
import {
  createUploadFile,
  getFiles,
} from "../controllers/upload.controller.js";

const router = Router();

router.get("/", getFiles);
router.post("/", createUploadFile);

export default router;
