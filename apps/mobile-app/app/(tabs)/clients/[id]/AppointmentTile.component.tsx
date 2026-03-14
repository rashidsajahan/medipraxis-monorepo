import {
  ButtonComponent,
  ButtonSize,
  ChipComponent,
  ChipVariant,
  TextComponent,
} from "@/components/basic";
import { Color, TextSize, TextVariant } from "@repo/config";
import {
  CalendarBlankIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PlusIcon,
} from "phosphor-react-native";
import React from "react";
import { View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "ONGOING"
  | "COMPLETED"
  | "UPCOMING"
  | "CANCELLED";

export interface Appointment {
  appointment_id: string;
  date: string;
  location?: string | null;
  status: AppointmentStatus;
}

export interface AppointmentTileProps {
  appointment: Appointment;
  dateLabel: string;
  onViewAppointment?: (appointmentId: string) => void;
  onAddRecord?: (appointmentId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatTime = (dateString: string): string =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getChipConfig = (
  status: AppointmentStatus
): { label: string; variant: ChipVariant } => {
  switch (status) {
    case "ONGOING":
      return { label: "Ongoing", variant: ChipVariant.Green };
    case "COMPLETED":
      return { label: "Completed", variant: ChipVariant.LightGreen };
    case "CANCELLED":
      return { label: "Cancelled", variant: ChipVariant.Danger };
    case "UPCOMING":
    default:
      return { label: "Upcoming", variant: ChipVariant.LightGreen };
  }
};

const getActionLabel = (
  dateLabel: string,
  status: AppointmentStatus
): string => {
  if (status === "ONGOING") return "Add Record";
  if (status === "UPCOMING") return "View Appointment";
  return "View Record";
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AppointmentTile: React.FC<AppointmentTileProps> = ({
  appointment,
  dateLabel,
  onViewAppointment,
  onAddRecord,
}) => {
  const { label: chipLabel, variant: chipVariant } = getChipConfig(
    appointment.status
  );

  const isOngoing = appointment.status === "ONGOING";
  const isUpcoming = appointment.status === "UPCOMING";
  const actionLabel = getActionLabel(dateLabel, appointment.status);

  const handleActionPress = () => {
    if (isOngoing) {
      onAddRecord?.(appointment.appointment_id);
    } else {
      onViewAppointment?.(appointment.appointment_id);
    }
  };

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3 border border-[#E5E5E5]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* ── ROW 1: Date Label + Action Button ──────────────────────────── */}
      <View className="flex-row justify-between items-center mb-4">
        <TextComponent
          variant={TextVariant.Title}
          size={TextSize.Small}
          color={Color.Black}
        >
          {dateLabel}
        </TextComponent>

        <ButtonComponent
          size={ButtonSize.Small}
          leftIcon={isOngoing ? PlusIcon : EyeIcon}
          buttonColor={Color.Black}
          textColor={Color.White}
          iconColor={Color.White}
          onPress={handleActionPress}
        >
          {actionLabel}
        </ButtonComponent>
      </View>

      {/* ── ROW 2: Date + Time + Location (location only for UPCOMING) ─── */}
      <View
        className="flex-row items-center gap-4"
        style={{ marginBottom: isUpcoming ? 0 : 16 }}
      >
        {/* Date */}
        <View className="flex-row items-center gap-2">
          <CalendarBlankIcon size={16} color={Color.Grey} weight="regular" />
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Small}
            color={Color.Grey}
          >
            {formatDate(appointment.date)}
          </TextComponent>
        </View>

        {/* Time */}
        <View className="flex-row items-center gap-2">
          <ClockIcon size={16} color={Color.Grey} weight="regular" />
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Small}
            color={Color.Grey}
          >
            {formatTime(appointment.date)}
          </TextComponent>
        </View>

        {/* Location — only shown on row 2 for UPCOMING */}
        {isUpcoming && appointment.location ? (
          <View className="flex-row items-center gap-1 flex-1 justify-end">
            <MapPinIcon size={14} color={Color.Grey} weight="regular" />
            <TextComponent
              variant={TextVariant.Body}
              size={TextSize.Small}
              color={Color.Grey}
            >
              {appointment.location}
            </TextComponent>
          </View>
        ) : null}
      </View>

      {/* ── ROW 3: Divider + Chip + Location (NOT for UPCOMING) ────────── */}
      {!isUpcoming ? (
        <>
          {/* Grey divider line */}
          <View className="border-t border-[#E5E5E5] mb-3" />

          {/* Status chip + location */}
          <View className="flex-row justify-between items-center">
            <ChipComponent text={chipLabel} variant={chipVariant} />

            {appointment.location ? (
              <View className="flex-row items-center gap-1">
                <MapPinIcon size={14} color={Color.Grey} weight="regular" />
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Grey}
                >
                  {appointment.location}
                </TextComponent>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );
};
