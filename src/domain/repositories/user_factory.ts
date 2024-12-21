import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../infrastructure/utils/prisma_client";
import { UserEntity } from "../entities/user";
import { EmailService } from "../../application/services/email_service_model";

export class UserFactory {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async register(
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

  public async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Credenziali non valide");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password || ""
      );
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

  public async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  public async getUsers() {
    return prisma.user.findMany();
  }

  public async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  public async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  public async findBirthdayUsers(): Promise<{
    birthdayUsers: UserEntity[];
    count: number;
  }> {
    try {
      const today = new Date();

      const users = await prisma.user.findMany({
        where: {
          birthday: {
            not: null,
          },
        },
      });

      const birthdayUsers = users
        .filter((user) => user.birthday !== null)
        .map(
          (user) =>
            new UserEntity(
              user.surname || "",
              user.name || "",
              user.birthday as Date,
              user.email
            )
        )
        .filter((user) => user.isBirthday(today));

      return {
        birthdayUsers,
        count: birthdayUsers.length,
      };
    } catch (error) {
      console.error("Errore durante la ricerca dei compleanni:", error);
      throw error;
    }
  }

  public async updateUser(id: string, data: Partial<Prisma.UserUpdateInput>) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });
      return updatedUser;
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'utente:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  public async sendBirthdayWishes(): Promise<{
    success: boolean;
    message: string;
    birthdayWishesSent: number;
  }> {
    try {
      const isConnected = await this.emailService.verifyConnection();
      if (!isConnected) {
        return {
          success: false,
          message: "Impossibile connettersi al server SMTP",
          birthdayWishesSent: 0,
        };
      }

      const { birthdayUsers, count } = await this.findBirthdayUsers();

      if (count === 0) {
        return {
          success: true,
          message: "Nessun compleanno oggi",
          birthdayWishesSent: 0,
        };
      }

      let successfulSent = 0;

      for (const user of birthdayUsers) {
        const emailSent = await this.emailService.sendEmail({
          to: user.email,
          subject: "Buon Compleanno! 🎂",
          content: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>Tanti Auguri di Buon Compleanno! 🎉</h1>
              <p>Caro/a ${user.getFullName()},</p>
              <p>Ti auguriamo un felicissimo compleanno!</p>
              <p>I migliori auguri,<br>Il team</p>
            </div>
          `,
        });

        if (emailSent) {
          successfulSent++;
        }
      }

      return {
        success: successfulSent > 0,
        message: `Inviati ${successfulSent} messaggi di auguri su ${count} totali`,
        birthdayWishesSent: successfulSent,
      };
    } catch (error) {
      console.error("Errore durante l'invio degli auguri:", error);
      return {
        success: false,
        message: "Errore durante l'elaborazione dei compleanni",
        birthdayWishesSent: 0,
      };
    }
  }
}
