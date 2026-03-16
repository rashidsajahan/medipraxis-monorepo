import { zValidator } from "@hono/zod-validator";
import { saveUserKeysSchema } from "@repo/models";
import { Hono } from "hono";
import { getUserKeysService } from "../lib/service-factory";
import { authMiddleware } from "../middleware/auth";
import type { Env } from "../types";

// Unauthenticated: returns only the public key for a given user
const userKeysPublic = new Hono<{ Bindings: Env }>().get(
  "/:userId/public-key",
  async (c) => {
    const userId = c.req.param("userId");
    const userKeysService = getUserKeysService(c);

    try {
      const publicKey = await userKeysService.getPublicKeyByUserId(userId);
      return c.json({ public_key: publicKey });
    } catch (e: any) {
      if (e.message === "User keys not found") {
        return c.json({ error: e.message }, 404);
      }
      return c.json({ error: e.message }, 500);
    }
  }
);

// Authenticated routes
const userKeysAuth = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .use("*", authMiddleware)
  .post(
    "/",
    zValidator("json", saveUserKeysSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: result.error }, 400);
      }
      return undefined;
    }),
    async (c) => {
      const { public_key, wrapped_private_key, pbkdf2_salt } =
        c.req.valid("json");
      const userId = c.get("user").sub as string;
      const userKeysService = getUserKeysService(c);

      try {
        const result = await userKeysService.saveUserKeys(
          userId,
          public_key,
          wrapped_private_key,
          pbkdf2_salt
        );
        return c.json(result, 201);
      } catch (e: any) {
        console.error("Save user keys error:", e);
        return c.json({ error: e.message }, 500);
      }
    }
  )
  .get("/", async (c) => {
    const userId = c.get("user").sub as string;
    const userKeysService = getUserKeysService(c);

    try {
      const result = await userKeysService.getUserKeys(userId);
      return c.json(result);
    } catch (e: any) {
      if (e.message === "User keys not found") {
        return c.json({ error: e.message }, 404);
      }
      return c.json({ error: e.message }, 500);
    }
  });

const userKeys = new Hono<{ Bindings: Env }>()
  .route("/", userKeysPublic)
  .route("/", userKeysAuth);

export default userKeys;
