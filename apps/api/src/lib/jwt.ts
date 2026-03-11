import { sign, verify } from "hono/jwt";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const signAccessToken = async (payload: object) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 15; // 15 minutes
  return await sign({ ...payload, iat, exp }, ACCESS_TOKEN_SECRET);
};

export const signRefreshToken = async (payload: object) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 30; // 30 days
  return await sign({ ...payload, iat, exp }, REFRESH_TOKEN_SECRET);
};

export const verifyAccessToken = async (token: string) => {
  try {
    return await verify(token, ACCESS_TOKEN_SECRET);
  } catch (e) {
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    return await verify(token, REFRESH_TOKEN_SECRET);
  } catch (e) {
    return null;
  }
};
