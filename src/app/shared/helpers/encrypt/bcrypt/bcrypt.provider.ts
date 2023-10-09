import bcrypt, { genSaltSync } from "bcrypt";

class BcryptProvider {
  static encryptPassword(password: string): string {
    const salt = genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  static comparePasswords(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}

export { BcryptProvider };

