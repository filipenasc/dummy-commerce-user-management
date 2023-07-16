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
      process.env.AUTH_SECRET_KEY || '123456',
      {
        ...(options?.expiresIn && { expiresIn: options.expiresIn }),
      }
    );
  }

  public static decode(token: string): DecodedToken {
    return jwt.verify(token, process.env.AUTH_SECRET_KEY || '123456') as DecodedToken;
  }
}
