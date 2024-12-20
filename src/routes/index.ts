import express from "express";
import userRouter from "./user";
import emailRouter from "./email";
const router = express.Router();

router.get("/", (_, res) => {
  res.send("Benvenuto nell'API con cui puoi inviare auguri 🎉");
});
router.use("/user", userRouter);
router.use("/email", emailRouter);

export default router;
