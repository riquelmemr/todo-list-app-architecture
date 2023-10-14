import { UserRepository } from "@app/features/users/repositories/user.repository";
import { LoginUserUseCase } from "@app/features/users/useCases";
import { TypeORMProvider } from "@main/database";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";

function makeSut() {
  const userRepository = new UserRepository();
  const loginUserUseCase = new LoginUserUseCase(userRepository);

  return loginUserUseCase;
}

describe("login-user-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http 400 when user not found", async () => {
    const loginUserUsecase = makeSut();

    const response = await loginUserUsecase.execute({
      email: "any_email",
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Utilize um email válido ou cadastre-se.");
  });

  it("should return http 400 when password incorrect", async () => {
    const loginUserUseCase = makeSut();

    const user = await UserBuilder.init().build();

    const response = await loginUserUseCase.execute({
      email: user.Email,
      password: "invalid_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Email e/ou senha inválidos!");
  });

  it("should return http code 200 when user exists and password is correct", async () => {
    const loginUserUseCase = makeSut();

    const user = await UserBuilder.init().build();

    const response = await loginUserUseCase.execute({
      email: user.Email,
      password: "any_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Usuário logado com sucesso!");
    expect(response.body.body).toHaveProperty("id");
    expect(response.body.body).toHaveProperty("name", user.Name);
    expect(response.body.body).toHaveProperty("email", user.Email);
  });
});
