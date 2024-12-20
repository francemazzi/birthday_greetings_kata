import express from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getUserByIdHandler,
  getUsersHandler,
  loginUserHandler,
  registerUserHandler,
} from "../controllers/user_controller";

const router = express.Router();

router.get("/", getUsersHandler);
router.post("/create", createUserHandler);
router.post("/register", registerUserHandler);
router.post("/login", loginUserHandler);
router.delete("/delete", deleteUserHandler);
router.get("/:id", getUserByIdHandler);

export default router;
