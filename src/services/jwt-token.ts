import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenOptions {
  expiresIn: string;
}

export interface DecodedToken extends JwtPayload {
  email: string;
}

export class JWTToken {
  public static generate(payload: object, options?: TokenOptions): string {
    return jwt.sign(
      payload,
      this.getAuthKey(),
      {
        ...(options?.expiresIn && { expiresIn: options.expiresIn }),
      }
    );
  }

  public static decode(token: string): DecodedToken {
    return jwt.verify(token, this.getAuthKey()) as DecodedToken;
  }

  private static getAuthKey(): string {
    const authKey = process.env.AUTH_SECRET_KEY;

    if (!authKey) throw new Error('AUTH_SECRET_KEY is not defined.')

    return authKey;
  }
}
