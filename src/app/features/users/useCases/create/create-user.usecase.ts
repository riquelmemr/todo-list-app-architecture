import {
  BcryptProvider,
  HttpResponse,
  IHttpResponse,
} from "../../../../shared/helpers";
import { UserRepository } from "../../repositories/user.repository";
import { ICreateUserRequestDTO } from "./create-user.dto";

class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: ICreateUserRequestDTO): Promise<IHttpResponse> {
    try {
      const { name, email, password } = data;

      const userFound = await this.userRepository.getByOne("email", email);

      if (userFound) {
        throw new Error("Já existe um usuário com esse email! Tente outro.");
      }

      const encryptedPassword = BcryptProvider.encryptPassword(password);

      const user = this.userRepository.createEntityInstance({
        name,
        email,
        password: encryptedPassword,
      });

      const userCreated = await this.userRepository.create(user);

      return HttpResponse.created({
        success: true,
        status: "Usuário criado com sucesso!",
        body: {
          id: userCreated.Id,
          name: userCreated.Name,
          email: userCreated.Email,
        },
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { CreateUserUseCase };

