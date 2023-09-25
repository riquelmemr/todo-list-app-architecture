interface ILoginUserRequestDTO {
  email: string;
  password: string;
}

interface ILoginUserResponseDTO {
  id: string;
  name: string;
  email: string;
}

export { ILoginUserRequestDTO, ILoginUserResponseDTO };

