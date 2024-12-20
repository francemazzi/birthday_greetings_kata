import express from "express";
import { CSVController } from "../controllers/file_reader_controller";
import { upload } from "../middleware/multer";
import { UserFactory } from "../../domain/repositories/user_factory";

const router = express.Router();
const userFactory = new UserFactory();
const csvController = new CSVController(userFactory);

router.post("/upload", upload.single("file"), csvController.uploadCSV);

export default router;
