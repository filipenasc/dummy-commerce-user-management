import bcrypt from 'bcrypt';

export class Password {
  public static async hash(password: string, salt = 10): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}