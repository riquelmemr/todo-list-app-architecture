import jwt from "jsonwebtoken";
import ENV from "../../../../envs/env";

class JWTProvider {
  static decodeToken(token: string) {
    return jwt.verify(token, ENV.Application.JWT_SECRET as string);
  }

  static generateToken(
    payload: any,
    expiresIn: number | string = ENV.Application.JWT_EXPIRES_IN as string
  ) {
    return jwt.sign(payload, ENV.Application.JWT_SECRET as string, {
      expiresIn: expiresIn,
    });
  }
}

export { JWTProvider };

