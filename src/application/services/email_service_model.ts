import { Socket, connect as netConnect } from "net";
import { TLSSocket, connect as tlsConnect } from "tls";

interface EmailOptions {
  to: string;
  subject: string;
  content: string;
}

export class EmailService {
  private host: string;
  private port: number;
  private username: string;
  private password: string;
  private useTLS: boolean;

  constructor() {
    this.host = process.env.SMTP_HOST || "";
    this.port = Number(process.env.SMTP_PORT) || 465;
    this.username = process.env.SMTP_USER || "";
    this.password = process.env.SMTP_PASSWORD || "";
    this.useTLS = this.port === 465;
  }

  private async createConnection(): Promise<Socket | TLSSocket> {
    return new Promise((resolve, reject) => {
      console.log(`Tentativo di connessione a ${this.host}:${this.port}`);

      const socket = netConnect({
        host: this.host,
        port: this.port,
      });

      socket.on("error", (error) => {
        console.error("Errore di connessione:", error);
        reject(error);
      });

      socket.on("connect", () => {
        console.log("Connessione stabilita 🎉");
        resolve(socket);
      });

      setTimeout(() => {
        socket.destroy();
        reject(new Error("Timeout della connessione"));
      }, 5000);
    });
  }

  private async sendCommand(
    socket: Socket | TLSSocket,
    command: string
  ): Promise<string> {
    return new Promise((resolve, _) => {
      let response = "";

      const onData = (data: Buffer) => {
        response += data.toString();
        if (response.endsWith("\r\n")) {
          socket.removeListener("data", onData);
          resolve(response.trim());
        }
      };

      socket.on("data", onData);
      socket.write(command + "\r\n");
    });
  }

  async sendEmail({ to, subject, content }: EmailOptions): Promise<boolean> {
    let socket: Socket | TLSSocket | null = null;

    try {
      socket = await this.createConnection();

      await this.sendCommand(socket, "EHLO " + this.host);

      await this.sendCommand(socket, "AUTH LOGIN");
      await this.sendCommand(
        socket,
        Buffer.from(this.username).toString("base64")
      );
      await this.sendCommand(
        socket,
        Buffer.from(process.env.SMTP_PASSWORD || "").toString("base64")
      );

      await this.sendCommand(socket, `MAIL FROM:<${this.username}>`);
      await this.sendCommand(socket, `RCPT TO:<${to}>`);
      await this.sendCommand(socket, "DATA");

      const message = [
        `From: ${this.username}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        content,
        ".",
      ].join("\r\n");

      await this.sendCommand(socket, message);
      await this.sendCommand(socket, "QUIT");

      console.log("Email inviata con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'invio dell'email:", error);
      return false;
    } finally {
      if (socket) {
        socket.end();
      }
    }
  }

  async verifyConnection(): Promise<boolean> {
    let socket: Socket | TLSSocket | null = null;

    try {
      console.log("Inizio verifica connessione...");
      socket = await this.createConnection();
      console.log("Connessione stabilita, invio comando EHLO");

      const response = await this.sendCommand(socket, "EHLO " + this.host);
      console.log("Risposta EHLO:", response);

      return true;
    } catch (error) {
      console.error("Errore dettagliato verifica connessione:", error);
      return false;
    } finally {
      if (socket) {
        socket.end();
      }
    }
  }
}
