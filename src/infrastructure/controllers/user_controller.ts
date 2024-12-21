import { Request, Response } from "express";
import { UserFactory } from "../../domain/repositories/user_factory";
import { BirthdayService } from "../../domain/repositories/birthday_service";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API per la gestione degli utenti
 */
class UserController {
  private userFactory: UserFactory;
  private birthdayService: BirthdayService;

  constructor() {
    this.userFactory = new UserFactory();
    this.birthdayService = new BirthdayService();
  }

  /**
   * @swagger
   * /user/send-birthday-email:
   *   post:
   *     summary: Invia email di compleanno
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Email inviate con successo
   */
  getBirthdayUsersHandler = async (_req: Request, res: Response) => {
    try {
      const result = await this.birthdayService.sendBirthdayWishes();
      res.json(result);
    } catch (error) {
      console.error("Errore nell'invio degli auguri di compleanno:", error);
      res.status(500).json({
        success: false,
        message: "Errore nell'invio degli auguri di compleanno",
      });
    }
  };

  /**
   * @swagger
   * /user/create:
   *   post:
   *     summary: Crea un nuovo utente
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               surname:
   *                 type: string
   *               birthday:
   *                 type: string
   *     responses:
   *       201:
   *         description: Utente creato con successo
   *       500:
   *         description: Errore del server
   */
  createUserHandler = async (req: Request, res: Response) => {
    try {
      const user = await this.userFactory.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Errore nella creazione dell'utente:", error);
      res.status(500).json({ error: "Errore nella creazione dell'utente" });
    }
  };

  async registerUserHandler(req: Request, res: Response) {
    try {
      const { email, password, name, surname } = req.body;
      const newUser = await this.userFactory.register(
        email,
        password,
        name,
        surname
      );
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      res.status(500).json({ error: "Errore durante la registrazione" });
    }
  }

  async loginUserHandler(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userFactory.login(email, password);
      res.status(200).json(user);
    } catch (error) {
      console.error("Errore durante il login:", error);
      res.status(401).json({ error: "Credenziali non valide" });
    }
  }

  /**
   * @swagger
   * /user/users:
   *   get:
   *     summary: Ottieni tutti gli utenti
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Lista di utenti
   */
  getUsersHandler = async (_req: Request, res: Response) => {
    try {
      const users = await this.userFactory.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
      res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
  };

  /**
   * @swagger
   * /user/delete:
   *   delete:
   *     summary: Cancella un utente
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   */
  deleteUserHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedUser = await this.userFactory.deleteUser(id);
      res.json(deletedUser);
    } catch (error) {
      console.error("Errore nella cancellazione dell'utente:", error);
      res.status(500).json({ error: "Errore nella cancellazione dell'utente" });
    }
  };

  /**
   * @swagger
   * /user/update:
   *   put:
   *     summary: Aggiorna un utente
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   */
  updateUserHandler = async (req: Request, res: Response) => {
    try {
      const { id, ...data } = req.body;
      const updatedUser = await this.userFactory.updateUser(id, data);
      res.json(updatedUser);
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'utente:", error);
      res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
    }
  };

  async getUserByIdHandler(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userFactory.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: "Utente non trovato" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      console.error("Errore nel recupero dell'utente per ID:", error);
      res.status(500).json({ error: "Errore nel recupero dell'utente per ID" });
      return;
    }
  }
}

export default new UserController();
