import { Request, Response } from "express";
import { Auth, Password } from "@src/services";
import { User, UserModel } from "@src/models";

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

export class AuthController {
  public async token(req: Request, res: Response): Promise<Response> {
    const { grant_type } = req.body;

    if (!grant_type) {
      return res.status(400).send({ message: "'grant_type' is required." });
    }

    if (grant_type === 'password') {
      return this.handleAccessTokenAuth(req.body, res);
    } else if (grant_type === 'refresh_token') {
      return this.handleRefreshTokenAuth(req.body, res)
    } else {
      return res.status(400).send({ message: `'${grant_type}' is not supported as a 'grant_type'.` });
    }
  }

  private async handleAccessTokenAuth(params: AccessTokenRequestParams, res: Response): Promise<Response> {
    const { email, password } = params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    const validPassword = await Password.compare(password as string, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    return res.status(200).send({
      access_token: this.generateAccessToken(user),
      refresh_token: this.generateRefreshToken(user),
      token_type: 'Bearer',
      expires_in: 86400,
    })
  }

  private async handleRefreshTokenAuth(params: RefreshTokenRequestParams, res: Response): Promise<Response> {
    const { refresh_token: refreshToken } = params;
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).send({ message: 'Invalid refresh token.' });
    } else {
      return res.status(200).send({
        access_token: this.generateAccessToken(user),
        token_type: 'Bearer',
        expires_in: 86400,
      });
    }
  }

  private generateAccessToken(user: UserModel): string {
    return Auth.generateToken(user, { expiresIn: '86400s' });
  }

  private generateRefreshToken(user: UserModel): string {
    return Auth.generateToken(user);
  }
}