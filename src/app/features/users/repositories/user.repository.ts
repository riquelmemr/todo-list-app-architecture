import User from "../../../models/user.model";
import { UserEntity } from "../../../shared/database/entities/user.entity";
import { BaseRepository } from "../../../shared/database/repositories";

class UserRepository extends BaseRepository<UserEntity, User> {
  constructor() {
    super();
    this.entityClass = UserEntity;
  }

  mapToModel(item: UserEntity): User {
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

