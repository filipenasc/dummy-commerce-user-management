import { EmailProviderInterface, EmailService } from "@src/services/email";
import { Auth } from "@src/services/auth";

export interface EmailRecipient {
  name: string;
  email: string;
}

export class SignupEmailConfirmation {
  private senderName = 'E-commerce App';
  private senderEmail = 'support@eccommerce.com';

  constructor(
    private emailService: EmailProviderInterface = new EmailService()
  ) {}

  public async sendEmail(recipient: EmailRecipient): Promise<void> {
    const { email, name } = recipient;

    const confirmationCode = Auth.generateToken({ email }, { expiresIn: '1h' });

    this.emailService.sendEmail({
      to: { name, email },
      from: {
        name: this.senderName,
        email: this.senderEmail,
      },
      subject: 'Welcome!',
      body: this.generateBody(confirmationCode)
    });
  }

  private generateBody(confirmationCode: string): string {
    // @todo: get this value dynamically
    const confirmationURL = 'http://localhost:3000/confirmation';

    return (
      `
        <a href="${confirmationURL}/${confirmationCode}">
          Click here to confirm your registration
        </a>
      `
    );
  }
}