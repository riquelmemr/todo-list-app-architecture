import { UserRepository } from '@app/features/users/repositories/user.repository';
import { LoginUserUseCase } from '@app/features/users/useCases';
import User from '@app/models/user.model';
import { BcryptProvider, JWTProvider } from '@app/shared/helpers';

function makeSut() {
  const userRepository = new UserRepository();
  const loginUserUseCase = new LoginUserUseCase(userRepository);

  return {
    userRepository,
    loginUserUseCase,
  }
}

describe('login-user-usecase', () => {
  jest.mock('@app/features/users/repositories/user.repository');

  it('should return http code 400 when user not found searching by email', async () => {
    const { userRepository, loginUserUseCase } = makeSut();

    jest.spyOn(userRepository, 'getByOne').mockResolvedValue(null);

    const response = await loginUserUseCase.execute({
      email: 'any_email',
      password: 'any_password',
    })

    expect(response).toStrictEqual({
      body: { error: "Utilize um email válido ou cadastre-se." },
      statusCode: 400,
    })
  })

  it('should return http code 200 when user logged', async () => {
    const { userRepository, loginUserUseCase } = makeSut();

    const userFound = new User(
      "any_id",
      "any_name",
      "any_email",
      "any_password",
      new Date()
    )

    jest.spyOn(userRepository, "getByOne").mockResolvedValue(userFound);
    jest.spyOn(BcryptProvider, "comparePasswords").mockReturnValue(true);
    jest.spyOn(JWTProvider, "generateToken").mockReturnValue("any_token");

    const response = await loginUserUseCase.execute({
      email: 'any_email',
      password: 'any_password',
    })

    expect(response).toStrictEqual({
      body: {
        success: true,
        status: "Usuário logado com sucesso!",
        token: "any_token",
        body: {
          id: userFound.Id,
          name: userFound.Name,
          email: userFound.Email,
        },
      },
      statusCode: 200
    })
  })
})