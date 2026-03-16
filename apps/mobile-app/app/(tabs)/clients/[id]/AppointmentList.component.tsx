import { TextComponent } from "@/components/basic";
import { Icons } from "@/config";
import {
  useFetchClientAppointmentRecords,
  useFetchClientAppointments,
} from "@/services/clients/useClientAppointment";
import { Color, TextSize, TextVariant } from "@repo/config";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  AppointmentTile,
  type Appointment,
  type AppointmentStatus,
} from "./AppointmentTile.component";

// task_statuses
// c2c4fceb = NOT_STARTED
// 6fe35772 = IN_PROGRESS
// 8e5cebbe = CANCELLED
// dbbdc7fa = COMPLETED

const STATUS_MAP: Record<string, AppointmentStatus> = {
  "c2c4fceb-1a22-4b66-bb25-b37faa712c3a": "NOT_STARTED",
  "6fe35772-6214-468c-ae26-1b2f2f067740": "IN_PROGRESS",
  "8e5cebbe-28a9-4623-9e7c-e127eb39ed4f": "CANCELLED",
  "dbbdc7fa-aba7-43ab-8252-4766c1fbcfc1": "COMPLETED",
};

const resolveStatus = (
  task_status_id: string | null,
  start_date: string
): AppointmentStatus => {
  const now = new Date();
  const start = new Date(start_date);
  const diffMs = now.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Auto-detect ONGOING: started within last 2 hours and still NOT_STARTED
  if (
    diffHours >= 0 &&
    diffHours <= 2 &&
    task_status_id === "c2c4fceb-1a22-4b66-bb25-b37faa712c3a"
  ) {
    return "ONGOING";
  }

  if (!task_status_id) return "NOT_STARTED";
  return STATUS_MAP[task_status_id] ?? "NOT_STARTED";
};


const now = new Date();

const DUMMY_APPOINTMENTS: Appointment[] = [
  // ONGOING — started 30 mins ago, NOT_STARTED in DB
  {
    appointment_id: "dummy-ongoing",
    date: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: "ONGOING",
  },
  // IN_PROGRESS
  {
    appointment_id: "dummy-inprogress",
    date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Room A",
    status: "IN_PROGRESS",
  },
  // NOT_STARTED — tomorrow (future)
  {
    appointment_id: "dummy-notstarted",
    date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: "NOT_STARTED",
  },
  // COMPLETED — yesterday
  {
    appointment_id: "dummy-completed",
    date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: "COMPLETED",
  },
  // CANCELLED — last week
  {
    appointment_id: "dummy-cancelled",
    date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MediHelp Clinic",
    status: "CANCELLED",
  },
];

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


interface AppointmentsListProps {
  clientId?: string;
  onViewAppointment?: (appointmentId: string) => void;
  onAddRecord?: (appointmentId: string) => void;
  searchQuery?: string;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  clientId,
  onViewAppointment,
  onAddRecord,
  searchQuery = "",
}) => {
  const { data: apiAppointments, isLoading } = useFetchClientAppointments(
    clientId ?? ""
  );

  // Fetch appointment records to know which appointments already have a record
  const { data: appointmentIdsWithRecords = new Set<string>() } =
    useFetchClientAppointmentRecords(clientId ?? "");

  // Use real API data when available, fall back to dummy data
  const data: Appointment[] =
    apiAppointments && apiAppointments.length > 0
      ? apiAppointments
      : DUMMY_APPOINTMENTS;

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color={Color.Green} />
      </View>
    );
  }

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
          hasRecord={appointmentIdsWithRecords.has(appt.appointment_id)}
          onViewAppointment={onViewAppointment}
          onAddRecord={onAddRecord}
        />
      ))}
    </View>
  );
};
