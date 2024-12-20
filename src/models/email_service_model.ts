import { Socket } from "net";
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

  constructor() {
    this.host = process.env.SMTP_HOST || "";
    this.port = Number(process.env.SMTP_PORT) || 465;
    this.username = process.env.SMTP_USER || "";
    this.password = Buffer.from(
      this.username + ":" + (process.env.SMTP_PASSWORD || "")
    ).toString("base64");
  }

  private createConnection(): Promise<TLSSocket> {
    return new Promise((resolve, reject) => {
      const socket = tlsConnect({
        host: this.host,
        port: this.port,
        servername: this.host,
      });

      socket.on("error", reject);
      socket.on("connect", () => resolve(socket));
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
    let socket: TLSSocket | null = null;

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
    let socket: TLSSocket | null = null;

    try {
      socket = await this.createConnection();
      const response = await this.sendCommand(socket, "EHLO " + this.host);
      console.log("Connessione SMTP verificata con successo");
      return response.startsWith("250");
    } catch (error) {
      console.error("Errore nella verifica della connessione SMTP:", error);
      return false;
    } finally {
      if (socket) {
        socket.end();
      }
    }
  }
}
