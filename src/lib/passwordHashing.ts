import bcrypt from 'bcrypt';

const saltRounds = 10;

const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
}

const comparePassword = async (password: string, hash: string) => {
  await bcrypt.compare(password, hash, function (err, result) {
    return result;
  });
}

export { encryptPassword, comparePassword };