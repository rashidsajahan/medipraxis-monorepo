import { z } from "genkit";
import { getUserId } from "../../context";
import { ai } from "../../models";

export const getAllAppointments = ai.defineTool(
  {
    name: "getAllAppointments",
    description:
      "Retrieve all appointments for a given date. Use this when the user wants to see, list, or check their appointments for a specific day.",
    inputSchema: z.object({
      date: z
        .string()
        .describe("The date to retrieve appointments for (YYYY-MM-DD)"),
    }),
    outputSchema: z.object({
      appointments: z.array(
        z.object({
          id: z.string(),
          patientName: z.string(),
          date: z.string(),
          time: z.string(),
          status: z.enum(["scheduled", "completed", "cancelled"]),
          notes: z.string().optional(),
        })
      ),
    }),
  },
  async (input) => {
    const userId = getUserId();
    console.log("[TOOL] getAllAppointments called with:", {
      ...input,
      userId,
    });

    // Mock data
    return {
      appointments: [
        {
          id: "apt-001",
          patientName: "John Smith",
          date: input.date,
          time: "09:00",
          status: "scheduled" as const,
          notes: `Follow-up consultation #${userId}`,
        },
        {
          id: "apt-002",
          patientName: "Sarah Johnson",
          date: input.date,
          time: "10:30",
          status: "scheduled" as const,
          notes: "Initial assessment",
        },
        {
          id: "apt-003",
          patientName: "Mike Williams",
          date: input.date,
          time: "14:00",
          status: "completed" as const,
        },
      ],
    };
  }
);

export const checkDateTime = ai.defineTool(
  {
    name: "checkDateTime",
    description:
      "Retrieve the current date and time. Use this when you need to know today's date or the current time to help answer the user's query.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      date: z.string().describe("Current date in YYYY-MM-DD format"),
      time: z.string().describe("Current time in HH:MM format"),
      dayOfWeek: z.string().describe("Current day of the week"),
    }),
  },
  async () => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return {
      date: now.toISOString().split("T")[0]!,
      time: now.toTimeString().slice(0, 5),
      dayOfWeek: days[now.getDay()]!,
    };
  }
);

export const appointmentTools = [getAllAppointments, checkDateTime];
