import { MailTrapClient } from "@src/clients/mailtrap";

interface EmailAddress {
  email: string;
  name: string;
}

export interface EmailMessageInterface {
  to: EmailAddress;
  from: EmailAddress;
  subject: string;
  body: string;
}

export interface EmailProviderInterface {
  sendEmail(message: EmailMessageInterface): Promise<void>;
}

export class EmailService {
  constructor(private emailProvider: EmailProviderInterface = new MailTrapClient()) {}

  public async sendEmail(message: EmailMessageInterface): Promise<void> {
    this.emailProvider.sendEmail(message);
  }
}