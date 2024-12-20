import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  login,
  register,
} from "../models/user_model";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    res.status(500).json({ error: "Errore nella creazione dell'utente" });
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, name, surname } = req.body;
    const newUser = await register(email, password, name, surname);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({ error: "Errore durante la registrazione" });
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    res.status(200).json(user);
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(401).json({ error: "Credenziali non valide" });
  }
};

export const getUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error);
    res.status(500).json({ error: "Errore nel recupero degli utenti" });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const deletedUser = await deleteUser(id);
    res.json(deletedUser);
  } catch (error) {
    console.error("Errore nella cancellazione dell'utente:", error);
    res.status(500).json({ error: "Errore nella cancellazione dell'utente" });
  }
};

export const getUserByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
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
};
