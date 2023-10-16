import { UserRepository } from "@app/features/users/repositories/user.repository";
import { CreateUserUseCase } from "@app/features/users/useCases";
import User from "@app/models/user.model";
import { UserEntity } from "@app/shared/database/entities/user.entity";

function makeSut() {
  const userRepository = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);

  return {
    userRepository,
    createUserUseCase,
  }
}

describe("create-user-usecase-unit", () => {
  jest.mock("@app/features/users/repositories/user.repository");

  it("should return http code 400 when user already exists", async () => {
    const { userRepository, createUserUseCase } = makeSut();
    
    const userFound = new User(
      "any_id",
      "any_name",
      "any_email",
      "any_password",
      new Date()
    );

    jest.spyOn(userRepository, "getByOne").mockResolvedValue(userFound);

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

  it("should return http code 201 created user", async () => {
    const { userRepository, createUserUseCase } = makeSut();

    const userCreated = new User(
      "any_id",
      "any_name",
      "any_email",
      "any_password",
      new Date()
    )

    jest.spyOn(userRepository, "getByOne").mockResolvedValue(null);
    jest.spyOn(userRepository, "create").mockResolvedValue(userCreated);
    jest.spyOn(userRepository, "createEntityInstance").mockReturnValue({} as UserEntity);

    const response = await createUserUseCase.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    })

    expect(response).toStrictEqual({
      statusCode: 201,
      body: {
        success: true,
        status: "Usuário criado com sucesso!",
        body: {
          id: "any_id",
          name: "any_name",
          email: "any_email",
        }
      }
    })
  })
});
