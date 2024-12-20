import express from "express";
import UserController from "../controllers/user_controller";

const router = express.Router();

router.get("/", UserController.getUsersHandler);
router.post("/create", UserController.createUserHandler);
router.post("/register", UserController.registerUserHandler);
router.post("/login", UserController.loginUserHandler);
router.delete("/delete", UserController.deleteUserHandler);
router.get("/:id", UserController.getUserByIdHandler);

export default router;
