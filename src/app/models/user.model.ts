class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private createdAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  public get Id(): string {
    return this.id;
  }

  public get Name(): string {
    return this.name;
  }

  public get Email(): string {
    return this.email;
  }

  public get Password(): string {
    return this.password;
  }
}

export default User;
