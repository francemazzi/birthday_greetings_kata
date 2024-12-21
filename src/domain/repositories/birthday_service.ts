import { EmailService } from "../../application/services/email_service_model";
import { UserFactory } from "./user_factory";

export class BirthdayService {
  private emailService: EmailService;
  private userFactory: UserFactory;

  constructor() {
    this.emailService = new EmailService();
    this.userFactory = new UserFactory();
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

      const { birthdayUsers, count } =
        await this.userFactory.findBirthdayUsers();

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
