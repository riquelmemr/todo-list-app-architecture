import {
  BcryptProvider,
  HttpResponse,
  IHttpResponse,
  JWTProvider,
} from "../../../../shared/helpers";
import { UserRepository } from "../../repositories/user.repository";
import { ILoginUserRequestDTO, ILoginUserResponseDTO } from "./login-user.dto";

class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: ILoginUserRequestDTO): Promise<IHttpResponse> {
    try {
      const { email, password } = data;

      const userFound = await this.userRepository.getByOne("email", email);

      if (!userFound) {
        throw new Error("Utilize um email válido ou cadastre-se.");
      }

      const matchPassword = BcryptProvider.comparePasswords(
        password,
        userFound.Password
      );

      if (!matchPassword) {
        throw new Error("Email e/ou senha inválidos!");
      }

      const response: ILoginUserResponseDTO = {
        id: userFound.Id,
        name: userFound.Name,
        email: userFound.Email,
      };

      const token = JWTProvider.generateToken(response);

      return HttpResponse.ok({
        success: true,
        status: "Usuário logado com sucesso!",
        body: response,
        token,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { LoginUserUseCase };

