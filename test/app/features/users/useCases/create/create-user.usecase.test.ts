import { UserRepository } from "@app/features/users/repositories/user.repository";
import { CreateUserUseCase } from "@app/features/users/useCases";
import { TypeORMProvider } from "@main/database";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";

function getData() {
  return {
    name: "any_name",
    email: "any_email",
    password: "any_password",
  };
}

function makeSut() {
  const userRepository = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);

  return createUserUseCase;
}

describe("create-user-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http code 400 when user (email) already exists", async () => {
    const createUserUseCase = makeSut();

    await UserBuilder.init().build();
    
    const response = await createUserUseCase.execute(getData());

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Já existe um usuário com esse email! Tente outro.");
  });

  it("should return http code 201 when create user", async () => {
    const createUserUseCase = makeSut();

    const response = await createUserUseCase.execute(getData());

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Usuário criado com sucesso!");
    expect(response.body.body).toHaveProperty("id");
    expect(response.body.body).toHaveProperty("name", "any_name");
    expect(response.body.body).toHaveProperty("email", "any_email");
  });
});
