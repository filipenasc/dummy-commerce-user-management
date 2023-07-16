import { Request, Response } from "express";
import { JWTToken } from "@src/services/jwt-token";
import { Password } from "@src/services/password";
import { User } from "@src/models";
import { BaseController } from "./base";
import { AuthError, InvalidParameterError } from "@src/lib/errors";

export type GrantType = 'password' | 'refresh_token';

export interface AccessTokenRequestParams {
  email: string;
  password: string;
  grant_type: GrantType;
}

export interface RefreshTokenRequestParams {
  refresh_token: string;
  grant_type: GrantType;
}

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

export class AuthController extends BaseController {
  public async token(req: Request, res: Response): Promise<void> {
    try {
      const { grant_type } = req.body;

      if (!grant_type) {
        throw new InvalidParameterError('grant_type', 'required');
      }

      let body;

      if (grant_type === 'password') {
        body = await this.handleAccessTokenAuth(req.body);
      } else if (grant_type === 'refresh_token') {
        body = await this.handleRefreshTokenAuth(req.body)
      } else {
        throw new InvalidParameterError('grant_type', 'not_supported')
      }

      res.status(200).send(body)
    } catch (error) {
      this.sendErrorResponse(res, error as Error);
    }
  }

  private async handleAccessTokenAuth(params: AccessTokenRequestParams): Promise<TokenResponse> {
    const { email, password } = params;
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

  private async handleRefreshTokenAuth(params: RefreshTokenRequestParams): Promise<TokenResponse> {
    const { refresh_token: refreshToken } = params;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new AuthError('Invalid refresh token.');

    return {
      access_token: JWTToken.generate(user.toJSON(), { expiresIn: '86400s' }),
      token_type: 'Bearer',
      expires_in: 86400,
    };
  }
}
