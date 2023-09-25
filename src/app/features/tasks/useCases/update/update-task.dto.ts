interface IUpdateTaskRequestDTO {
  id: string;
  title: string;
  description: string;
  done: boolean;
  archived: boolean;
  finishedDate: Date | null;
}

export { IUpdateTaskRequestDTO };

