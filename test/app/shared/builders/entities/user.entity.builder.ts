import { UserRepository } from "@app/features/users/repositories/user.repository";
import User from "@app/models/user.model";
import { BcryptProvider } from "@app/shared/helpers";

class UserBuilder {
  private name: string = "any_name";
  private email: string = "any_email";
  private password: string = "any_password";

  constructor(private userRepository: UserRepository = new UserRepository()) {}

  static init(): UserBuilder {
    const build = new UserBuilder();
    return build;
  }

  async build(): Promise<User> {
    const encryptedPassword = BcryptProvider.encryptPassword(
      this.password
    );

    const user = this.userRepository.createEntityInstance({
      name: this.name,
      email: this.email,
      password: encryptedPassword,
    });

    return this.userRepository.create(user);
  }
}

export { UserBuilder };

