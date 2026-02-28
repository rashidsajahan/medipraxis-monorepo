import { zValidator } from "@hono/zod-validator";
import {
  createFormSchema,
  getFormParamSchema,
  getFormQuerySchema,
} from "@repo/models";
import { Hono } from "hono";
import { FormController } from "../controllers";

const forms = new Hono()
  .post("/", zValidator("json", createFormSchema), FormController.saveForm)
  .get(
    "/",
    zValidator("query", getFormQuerySchema),
    FormController.getFormsByUserId
  )
  .get(
    "/:id",
    zValidator("param", getFormParamSchema),
    FormController.getFormById
  );

export default forms;
