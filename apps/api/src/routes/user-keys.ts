import { zValidator } from "@hono/zod-validator";
import { saveUserKeysSchema } from "@repo/models";
import { Hono } from "hono";
import { getUserKeysService } from "../lib/service-factory";
import { authMiddleware } from "../middleware/auth";
import type { Env } from "../types";

const userKeys = new Hono<{ Bindings: Env }>()
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

export default userKeys;
