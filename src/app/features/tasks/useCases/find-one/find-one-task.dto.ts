interface TaskJSON {
  id: string;
  title: string;
  done: boolean;
  archived: boolean;
  createdAt: Date;
  finishedDate: Date | null;
  userId: string;
}

export { TaskJSON };
