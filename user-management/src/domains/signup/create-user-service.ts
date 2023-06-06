import { GenerateTokenInterface } from '../../domains/authentication/generate-token-interface';
import { EmailProviderInterface } from '../../domains/email/email-provider-interface';
import { User } from '../../entities/user';
import { UsersRepositoryInterface } from '../../repositories/users-repository-interface';
import { CreateUserDTO } from './create-user-dto';

export class CreateUserService {
  constructor(private usersRepository: UsersRepositoryInterface, private mailProvider: EmailProviderInterface, private tokenGenerator: GenerateTokenInterface) {}

  async execute(data: CreateUserDTO) {
    const userAlreadyExists = await this.usersRepository.findByUsername(data.username);
    console.log({ userAlreadyExists })
    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    const user = new User(data);

    await this.usersRepository.create(user);

    const emailConfirmationCode = this.tokenGenerator.generate(user, { expiresIn: '1d' });

    console.log({emailConfirmationCode})

    // this.mailProvider.sendMail({
    //   to: {
    //     name: data.username,
    //     email: data.email,
    //   },
    //   from: {
    //     name: 'E-commerce App',
    //     email: 'support@eccommerce.com',
    //   },
    //   subject: 'Welcome!',
    //   body: `<a href="http://localhost:3000/confirmation/${emailConfirmationCode}">Click this link to confirm your email</a>`
    // })
  }
}