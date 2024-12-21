import express from "express";
import UserController from "../controllers/user_controller";

const router = express.Router();

/**
 * LOGICA richiesta dall'esercizio
 */
router.post("/send-birthday-email", UserController.getBirthdayUsersHandler);

/**
 * LOGICHE CRUD su user
 */
router.get("/users", UserController.getUsersHandler);
router.post("/create", UserController.createUserHandler);
router.put("/update", UserController.updateUserHandler);
router.post("/register", UserController.registerUserHandler);
router.post("/login", UserController.loginUserHandler);
router.delete("/delete", UserController.deleteUserHandler);
router.get("/:id", UserController.getUserByIdHandler);

export default router;
