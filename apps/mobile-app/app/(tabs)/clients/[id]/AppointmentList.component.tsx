import { TextComponent } from "@/components/basic";
import { Icons } from "@/config";
import { Color, TextSize, TextVariant } from "@repo/config";
import React from "react";
import { View } from "react-native";
import {
  AppointmentTile,
  type Appointment,
  type AppointmentStatus,
} from "./AppointmentTile.component";

// ─── Status ID → AppointmentStatus mapping ────────────────────────────────────

const STATUS_MAP: Record<string, AppointmentStatus> = {
  "c2c4fceb-1a22-4b66-bb25-b37faa712c3a": "UPCOMING",
  "8e5cebbe-28a9-4623-9e7c-e127eb39ed4f": "COMPLETED",
  "dbbdc7fa-aba7-43ab-8252-4766c1fbcfc1": "CANCELLED",
};

const resolveStatus = (
  task_status_id: string | null,
  start_date: string
): AppointmentStatus => {
  const now = new Date();
  const start = new Date(start_date);
  const diffMs = now.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (
    diffHours >= 0 &&
    diffHours <= 2 &&
    task_status_id === "c2c4fceb-1a22-4b66-bb25-b37faa712c3a"
  ) {
    return "ONGOING";
  }

  if (!task_status_id) return "UPCOMING";
  return STATUS_MAP[task_status_id] ?? "UPCOMING";
};

// ─── Dummy data — all 4 statuses covered ─────────────────────────────────────
// Using real appointment IDs from Ms Aone Test + fabricated dates to
// demonstrate every status variant clearly.

const now = new Date();

const DUMMY_APPOINTMENTS: Appointment[] = [
  // ONGOING — started 30 mins ago, status UPCOMING → resolves to ONGOING
  {
    appointment_id: "0bf81928-9ed3-49ca-a5ad-4b63208247c0",
    date: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "c2c4fceb-1a22-4b66-bb25-b37faa712c3a",
      new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    ),
  },
  // UPCOMING — tomorrow
  {
    appointment_id: "5dadb105-e3f6-432e-a4e2-1bcc02a0b907",
    date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "c2c4fceb-1a22-4b66-bb25-b37faa712c3a",
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    ),
  },
  // UPCOMING — this week (3 days from now)
  {
    appointment_id: "df2441bc-1d6d-40d3-ab7c-9d7177ea1455",
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "c2c4fceb-1a22-4b66-bb25-b37faa712c3a",
      new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
  // COMPLETED — yesterday
  {
    appointment_id: "839b8d22-51ba-4004-a96d-89003c95911e",
    date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "8e5cebbe-28a9-4623-9e7c-e127eb39ed4f",
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    ),
  },
  // COMPLETED — last week
  {
    appointment_id: "746fdec5-56c3-4008-b8bb-53b061b92fa5",
    date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "8e5cebbe-28a9-4623-9e7c-e127eb39ed4f",
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
  // CANCELLED — 2 weeks ago
  {
    appointment_id: "874902bc-e64c-46be-9110-65ea175cb91f",
    date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: resolveStatus(
      "dbbdc7fa-aba7-43ab-8252-4766c1fbcfc1",
      new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
];

// ─── Date label helper ────────────────────────────────────────────────────────

export const getDateLabel = (dateString: string): string => {
  const appointmentDate = new Date(dateString);
  const today = new Date();

  const stripTime = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (stripTime(appointmentDate).getTime() - stripTime(today).getTime()) /
      86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < -1 && diffDays >= -7) return "Last Week";
  if (diffDays > 1 && diffDays <= 7) return "This Week";

  return appointmentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─── AppointmentsList ─────────────────────────────────────────────────────────

interface AppointmentsListProps {
  appointments?: Appointment[];
  onViewAppointment?: (appointmentId: string) => void;
  onAddRecord?: (appointmentId: string) => void;
  searchQuery?: string;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  onViewAppointment,
  onAddRecord,
  searchQuery = "",
}) => {
  // Fall back to dummy data if appointments is undefined OR empty
  const data =
    !appointments || appointments.length === 0
      ? DUMMY_APPOINTMENTS
      : appointments;

  // Sort: most recent / soonest first
  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filtered = sorted.filter((appt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const label = getDateLabel(appt.date).toLowerCase();
    const loc = (appt.location ?? "").toLowerCase();
    const dateStr = new Date(appt.date)
      .toLocaleDateString("en-GB")
      .toLowerCase();
    return label.includes(q) || loc.includes(q) || dateStr.includes(q);
  });

  if (filtered.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Icons.CalendarBlank
          size={64}
          color={Color.LightGrey}
          weight="regular"
        />
        <TextComponent
          variant={TextVariant.Body}
          size={TextSize.Medium}
          color={Color.Grey}
          style={{ marginTop: 16, textAlign: "center" }}
        >
          No appointments found
        </TextComponent>
      </View>
    );
  }

  return (
    <View className="pt-1">
      {filtered.map((appt) => (
        <AppointmentTile
          key={appt.appointment_id}
          appointment={appt}
          dateLabel={getDateLabel(appt.date)}
          onViewAppointment={onViewAppointment}
          onAddRecord={onAddRecord}
        />
      ))}
    </View>
  );
};
