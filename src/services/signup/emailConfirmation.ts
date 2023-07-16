import { EmailProviderInterface, EmailService } from "@services/email";
import { JWTToken } from "@src/services/jwt-token";

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

    const confirmationCode = JWTToken.generate({ email }, { expiresIn: '1h' });

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
