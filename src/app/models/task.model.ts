class Task {
  constructor(
    private id: string,
    private title: string,
    private description: string,
    private userId: string,
    private done: boolean,
    private archived: boolean,
    private createdAt: Date,
    private finishedDate?: Date | null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.done = done || false;
    this.archived = archived || false;
    this.createdAt = createdAt;
    this.userId = userId;
    this.finishedDate = finishedDate;
  }

  public get Id(): string {
    return this.id;
  }

  public get Title(): string {
    return this.title;
  }

  public get Description(): string {
    return this.description;
  }

  public get Done(): boolean {
    return this.done;
  }

  public get Archived(): boolean {
    return this.archived;
  }

  public get UserId(): string {
    return this.userId;
  }

  public get CreatedAt(): Date {
    return this.createdAt;
  }

  public get FinishedDate(): Date | null | undefined {
    return this.finishedDate;
  }
}

export default Task;
