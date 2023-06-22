import { randomUUID } from "crypto";

export class User {
  public id: string;
  public username: string;
  public email: string;
  public password: string;
  public confirmedAt?: Date;

  constructor(props: Omit<User, 'id'>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = randomUUID();
    }
  }
}