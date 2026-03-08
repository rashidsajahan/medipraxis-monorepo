import { zValidator } from "@hono/zod-validator";
import { createAppointmentRecordSchema } from "@repo/models";
import { Hono } from "hono";
import { AppointmentRecordController } from "../controllers";

const appointmentRecords = new Hono().post(
  "/",
  zValidator("json", createAppointmentRecordSchema),
  AppointmentRecordController.create
);

export default appointmentRecords;
