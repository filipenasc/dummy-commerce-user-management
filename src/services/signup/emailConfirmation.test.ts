import { Auth } from '@src/services/auth';
import { SignupEmailConfirmation } from '@src/services/signup/emailConfirmation';
import { EmailService } from '../email';

const name = 'User';
const email = 'user@example.org';

jest.mock('@src/services/email');
jest.mock('@src/services/auth');

describe('SignupEmailConfirmation', () => {
  const emailService = new EmailService as jest.Mocked<EmailService>;
  const authService = Auth as jest.Mocked<typeof Auth>;

  const confirmationCode = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5vcmciLCJpYXQiOjE2ODgyMTkwMDYsImV4cCI6MTY4ODIyMjYwNn0.uQlsun_bjEmqTUJ5nTquvh4fqlz2aVWBVXVwuRE42PI`;
  authService.generateToken.mockReturnValue(confirmationCode);

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