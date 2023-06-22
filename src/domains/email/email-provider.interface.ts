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
  sendMail(message: EmailMessageInterface): Promise<void>;
}