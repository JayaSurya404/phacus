import jwt from "jsonwebtoken";

export const signJwt = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};