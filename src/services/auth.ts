import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}