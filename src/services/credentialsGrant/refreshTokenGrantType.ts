import { AuthError } from "@src/lib/errors";
import { User } from "@src/models";
import { JWTToken } from "../jwt-token";

export interface RefreshTokenGrantTypeParams {
  refresh_token: string
}

export interface Credentials {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export class RefreshTokenGrantType {
  public static async grantCredentials(grantTypeParams: RefreshTokenGrantTypeParams): Promise<Credentials> {
    const { refresh_token: refreshToken } = grantTypeParams;

    const user = await User.findOne({ refreshToken });

    if (!user) throw new AuthError('Invalid refresh token.');

    return {
      access_token: JWTToken.generate(user.toJSON(), { expiresIn: '86400s' }),
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400,
    };
  }
}
