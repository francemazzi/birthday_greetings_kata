import express from "express";
import userRouter from "./user";
import emailRouter from "./email";
import fileRouter from "./file";
const router = express.Router();

router.get("/", (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Auguri</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-decoration: none;
            margin-top: 20px;
            display: inline-block;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>👋 Benvenuto nell'API che invia gli Auguri ai tuoi colleghi!</h1>
          <p>Esplora la nostra documentazione per scoprire tutte le funzionalità disponibili.</p>
          <a href="/api-docs" class="button">Vai alla documentazione</a>
        </div>
      </body>
    </html>
  `);
});
router.use("/user", userRouter);
router.use("/email", emailRouter);
router.use("/file", fileRouter);

export default router;
