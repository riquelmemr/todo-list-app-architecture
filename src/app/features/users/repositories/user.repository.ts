import { DeepPartial, Repository } from "typeorm";
import { TypeORMProvider } from "../../../../main/database";
import User from "../../../models/user.model";
import { UserEntity } from "../../../shared/database/entities/user.entity";

class UserRepository {
  private getRepository(): Repository<UserEntity> {
    return TypeORMProvider.client.getRepository(UserEntity);
  }

  async create(user: UserEntity): Promise<User> {
    const repository = this.getRepository();
    const result = await repository.save(user);

    return this.mapToModel(result);
  }

  async getByOne(key: string, value: string): Promise<User | null> {
    const repository = this.getRepository();
    const item = await repository.findOne({
      where: { [key]: value },
    });

    return item ? this.mapToModel(item) : null;
  }

  public createEntityInstance(item: DeepPartial<UserEntity>): UserEntity {
    return TypeORMProvider.client.manager.create(
      UserEntity,
      item
    ) as UserEntity;
  }

  private mapToModel(item: UserEntity): User {
    return new User(
      item.id,
      item.name,
      item.email,
      item.password,
      item.createdAt
    );
  }
}

export { UserRepository };
export const userRepository = new UserRepository();
