import { Request, Response } from "express";
import { EmailService } from "../models/email_service_model";

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public sendEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { to, subject, content } = req.body;

      if (!to || !subject || !content) {
        return res.status(400).json({
          success: false,
          message: "I campi to, subject e content sono obbligatori",
        });
      }

      const isConnected = await this.emailService.verifyConnection();
      if (!isConnected) {
        return res.status(500).json({
          success: false,
          message: "Impossibile connettersi al server SMTP",
        });
      }

      const success = await this.emailService.sendEmail({
        to,
        subject,
        content,
      });

      if (success) {
        return res.status(200).json({
          success: true,
          message: "Email inviata con successo",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Errore durante l'invio dell'email",
        });
      }
    } catch (error) {
      console.error("Errore nel controller email:", error);
      return res.status(500).json({
        success: false,
        message: "Errore interno del server",
      });
    }
  };
}
