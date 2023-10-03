import { UserRepository } from "../../../../../../src/app/features/users/repositories/user.repository";
import { CreateUserUseCase } from "../../../../../../src/app/features/users/useCases";
import User from "../../../../../../src/app/models/user.model";
import { RedisProvider } from "../../../../../../src/main/database/redis.provider";
import { TypeORMProvider } from "../../../../../../src/main/database/typeorm.provider";

describe("create-user-usecase", () => {
  jest.mock("../../../../../../src/app/shared/database/repositories");

  beforeAll(async () => {
    await TypeORMProvider.connect();
    await RedisProvider.connect();
  });

  afterAll(async () => {
    await TypeORMProvider.disconnect();
    RedisProvider.disconnect();
  });

  it("should return reject error if user already exists", async () => {
    const userRepository = new UserRepository();
    
    const userFound = new User(
      "any_id",
      "any_name",
      "any_email",
      "any_password",
      new Date()
    );

    jest.spyOn(userRepository, "getByOne").mockResolvedValue(userFound);

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const response = await createUserUseCase.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(response).toStrictEqual({
      body: { error: "Já existe um usuário com esse email! Tente outro." },
      statusCode: 400,
    });
  });
});
