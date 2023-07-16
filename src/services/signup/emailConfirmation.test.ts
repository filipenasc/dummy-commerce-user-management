import { SignupEmailConfirmation } from '@services/signup/emailConfirmation';
import { EmailService } from '@services/email';
import { JWTToken } from '../jwt-token';

const name = 'User';
const email = 'user@example.org';

jest.mock('@services/email');
jest.mock('@services/jwt-token');

describe('SignupEmailConfirmation', () => {
  const emailService = new EmailService as jest.Mocked<EmailService>;
  const authService = JWTToken as jest.Mocked<typeof JWTToken>;

  const confirmationCode = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5vcmciLCJpYXQiOjE2ODgyMTkwMDYsImV4cCI6MTY4ODIyMjYwNn0.uQlsun_bjEmqTUJ5nTquvh4fqlz2aVWBVXVwuRE42PI`;
  authService.generate.mockReturnValue(confirmationCode);

  it('calls the email service with the correct arguments', async () => {
    const emailConfirmationService = new SignupEmailConfirmation(emailService);
    await emailConfirmationService.sendEmail({ name, email });
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      to: { name, email },
      from: {
        name: 'E-commerce App',
        email: 'support@eccommerce.com',
      },
      subject: 'Welcome!',
      body: `
        <a href="http://localhost:3000/confirmation/${confirmationCode}">
          Click here to confirm your registration
        </a>
      `
    });
  });
});
