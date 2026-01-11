import { zValidator } from "@hono/zod-validator";
import {
  cancelAppointmentByClientSchema,
  createTaskSchema,
  getAllTasksQuerySchema,
  getAppointmentsByClientQuerySchema,
  getTaskParamSchema,
  reserveAppointmentByClientSchema,
  updateTaskParamSchema,
  updateTaskSchema,
} from "@repo/models";
import { Hono } from "hono";
import { TaskController } from "../controllers";

const tasks = new Hono()
  .post("/", zValidator("json", createTaskSchema), TaskController.createTask)
  .get(
    "/",
    zValidator("query", getAllTasksQuerySchema),
    TaskController.getAllTasks
  )
  .get(
    "/appointments",
    zValidator("query", getAllTasksQuerySchema),
    TaskController.getAllAppointments
  )
  .get(
    "/appointments/client",
    zValidator("query", getAppointmentsByClientQuerySchema),
    TaskController.getAppointmentsByClient
  )
  .get(
    "/:id",
    zValidator("param", getTaskParamSchema),
    TaskController.getTaskById
  )
  .put(
    "/:id",
    zValidator("param", updateTaskParamSchema),
    zValidator("json", updateTaskSchema),
    TaskController.updateTask
  )
  // Appointment reservation routes
  .post(
    "/appointments/reserve",
    zValidator("json", reserveAppointmentByClientSchema),
    TaskController.reserveAppointmentByClient
  )
  .post(
    "/appointments/cancel",
    zValidator("json", cancelAppointmentByClientSchema),
    TaskController.cancelAppointmentByClient
  );

export default tasks;
