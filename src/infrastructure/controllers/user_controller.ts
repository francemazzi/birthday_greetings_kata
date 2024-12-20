import { Request, Response } from "express";
import { UserFactory } from "../../domain/repositories/user_factory";

class UserController {
  private userFactory = new UserFactory();
  async createUserHandler(req: Request, res: Response) {
    try {
      const user = await this.userFactory.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Errore nella creazione dell'utente:", error);
      res.status(500).json({ error: "Errore nella creazione dell'utente" });
    }
  }

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

  async getUsersHandler(_req: Request, res: Response) {
    try {
      const users = await this.userFactory.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
      res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
  }

  async deleteUserHandler(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const deletedUser = await this.userFactory.deleteUser(id);
      res.json(deletedUser);
    } catch (error) {
      console.error("Errore nella cancellazione dell'utente:", error);
      res.status(500).json({ error: "Errore nella cancellazione dell'utente" });
    }
  }

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
