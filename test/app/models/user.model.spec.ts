import User from "../../../src/app/models/user.model";

describe("user-model", () => {
  it("should create an instance", () => {
    const createdAt = new Date();
    const user = new User(
      "any_id",
      "any_name",
      "any_email",
      "any_password",
      createdAt
    );

    expect(user).toEqual({
      id: user.Id,
      name: user.Name,
      email: user.Email,
      password: user.Password,
      createdAt,
    });
  });
});
