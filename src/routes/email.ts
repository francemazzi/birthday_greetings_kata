import express from "express";
import { EmailController } from "../controllers/email_service_controller";

const router = express.Router();
const emailController = new EmailController();

router.post("/send", emailController.sendEmail);

export default router;
