import { Prisma, User } from "@prisma/client";
import prisma from "../utils/prisma_client";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const createUser = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  return prisma.user.create({ data });
};

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

export async function register(
  email: string,
  password: string,
  name?: string,
  surname?: string
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("L'utente esiste già");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.SESSION_SECRET as string,
      { expiresIn: "30d" }
    );

    return { newUser, token };
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Credenziali non valide");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      throw new Error("Credenziali non valide");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.SESSION_SECRET as string,
      { expiresIn: "30d" }
    );

    return { user, token };
  } catch (error) {
    console.error("Errore durante il login:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
