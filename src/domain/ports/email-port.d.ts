export interface EmailOptions {
  to: string;
  subject: string;
  content: string;
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<boolean>;
  verifyConnection(): Promise<boolean>;
}
