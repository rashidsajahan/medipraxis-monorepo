import { zValidator } from "@hono/zod-validator";
import {
  createAppointmentRecordSchema,
  getAppointmentRecordQuerySchema,
} from "@repo/models";
import { Hono } from "hono";
import { AppointmentRecordController } from "../controllers";

const appointmentRecords = new Hono()
  .post(
    "/",
    zValidator("json", createAppointmentRecordSchema),
    AppointmentRecordController.create
  )
  .get(
    "/",
    zValidator("query", getAppointmentRecordQuerySchema),
    AppointmentRecordController.getByClientId
  );

export default appointmentRecords;
