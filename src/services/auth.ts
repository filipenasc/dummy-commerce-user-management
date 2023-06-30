import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenOptions {
  expiresIn: string;
}

export interface DecodedToken extends JwtPayload {
  email: string;
}

export class Auth {
  public static generateToken(payload: object, options?: TokenOptions): string {
    return jwt.sign(
      payload,
      process.env.AUTH_SECRET_KEY as string,
      {
        ...(options?.expiresIn && { expiresIn: options.expiresIn }),
      }
    );
  }

  public static decodeToken(token: string): DecodedToken {
    return jwt.verify(token, process.env.AUTH_SECRET_KEY as string) as DecodedToken;
  }
}