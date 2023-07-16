import { AuthError } from "@src/lib/errors";
import { User } from "@src/models";
import { JWTToken } from "../jwt-token";
import { Password } from "../password";

export interface Credentials {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface PasswordGrantTypeParams {
  email: string
  password: string
}

export class PasswordGrantType {
  public static async grantCredentials(grantTypeParams: PasswordGrantTypeParams): Promise<Credentials> {
    const { email, password } = grantTypeParams;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthError('Invalid email or password.');
    }

    const validPassword = await Password.compare(password as string, user.password);

    if (!validPassword) {
      throw new AuthError('Invalid email or password.');
    }

    return {
      access_token: JWTToken.generate(user.toJSON(), { expiresIn: '86400s' }),
      refresh_token: JWTToken.generate(user.toJSON()),
      token_type: 'Bearer',
      expires_in: 86400,
    }
  }
}
