// interface UserInterface {
//   id: string;
//   username: string;
//   password: string;
//   isAdmin: boolean;
//   refreshToken: string;
// };

import { randomUUID } from "crypto";

// const users: UserInterface[] = [
//   {
//     id: '1',
//     username: 'filipenasc',
//     password: '123456',
//     isAdmin: true,
//     refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2ODYwMTMzODl9.ywK8mXTnEENoKAEfJmMAFDYnKOlzfiCfLDwNDKLlwM8',
//   },
//   {
//     id: '2',
//     username: 'miles',
//     password: '123456',
//     isAdmin: false,
//     refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2ODYwMDkxNzV9.5b30qnq61jdUma_zX9TO-KQ1zkm2ZKLfJexp3HzfPWI',
//   },
// ];

// const User = {
//   find: (id: string): UserInterface => users.find(u => u.id === id),
//   findByRefreshToken: (refreshToken: string | string[]): UserInterface => users.find(u => u.refreshToken === refreshToken),
//   findByCredentials: (username: string, password: string): UserInterface => users.find(u => u.username === username && u.password === password),
// };

// export default User;

export class User {
  public id: string;
  public username: string;
  public email: string;
  public password: string;
  public refreshToken?: string;
  public confirmedAt?: Date;

  constructor(props: Omit<User, 'id'>, id?: string, refreshToken?: string) {
    Object.assign(this, props);

    this.confirmed = false;

    if (!id) {
      this.id = randomUUID();
    }
  }
}