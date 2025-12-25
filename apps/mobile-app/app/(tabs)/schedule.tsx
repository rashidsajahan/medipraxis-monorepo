import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import {
  AgendaData,
  AgendaSelection,
  AgendaSelectionType,
  CalendarComponent,
} from "@/components/advanced";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AgendaSelection | null>(null);

  // Debug toast when appointment/reminder is selected
  useEffect(() => {
    if (selectedAppointment) {
      if (selectedAppointment.type === AgendaSelectionType.Appointment) {
        Alert.alert(
          "Appointment Selected",
          `Appointment ID: ${selectedAppointment.appointmentId}\nGroup ID: ${selectedAppointment.groupId || "null"}`,
          [{ text: "OK", onPress: () => setSelectedAppointment(null) }]
        );
      } else if (selectedAppointment.type === AgendaSelectionType.EmptySlot) {
        Alert.alert(
          "Empty Slot Selected",
          `Group ID: ${selectedAppointment.groupId}\nSlot Number: ${selectedAppointment.slotNumber}`,
          [{ text: "OK", onPress: () => setSelectedAppointment(null) }]
        );
      } else if (selectedAppointment.type === AgendaSelectionType.Reminder) {
        Alert.alert(
          "Reminder Selected",
          `Reminder ID: ${selectedAppointment.reminderId}`,
          [{ text: "OK", onPress: () => setSelectedAppointment(null) }]
        );
      }
    }
  }, [selectedAppointment]);

  // Sample agenda data - replace this with your actual data
  const sampleAgendaData: AgendaData = {
    timeBlocks: [
      {
        content: { id: "apt-001", title: "Appointment", client: "John Doe" },
        startTime: "1:00 am",
        endTime: "2:00 am",
      },
    ],
    timeBlockGroups: [
      {
        id: "group-001",
        startTime: "3:30 am",
        endTime: "5:30 am",
        slots: 8,
        contents: [
          { id: "apt-002", title: "Appointment", client: "Anna" },
          null,
          { id: "apt-003", title: "Appointment", client: "Michael" },
          { id: "apt-004", title: "Appointment", client: "Sophie" },
          null,
          { id: "apt-005", title: "Appointment", client: "Ella" },
          null,
          null,
        ],
      },
      {
        id: "group-002",
        startTime: "8:15 am",
        endTime: "10:15 am",
        slots: 12,
        contents: [
          { id: "apt-006", title: "Appointment", client: "David" },
          null,
          { id: "apt-007", title: "Appointment", client: "Emma" },
          { id: "apt-008", title: "Appointment", client: "Oliver" },
          null,
          null,
          { id: "apt-009", title: "Appointment", client: "Liam" },
          null,
          null,
          { id: "apt-010", title: "Appointment", client: "Noah" },
          null,
          null,
        ],
      },
    ],
    reminders: [
      {
        content: { id: "rem-001", title: "Check records" },
        startTime: "2:30 am",
      },
      {
        content: { id: "rem-002", title: "Call pharmacy" },
        startTime: "6:00 am",
      },
      {
        content: { id: "rem-003", title: "Review lab results" },
        startTime: "7:30 am",
      },
      {
        content: { id: "rem-004", title: "Follow up with patient" },
        startTime: "9:45 am",
      },
      {
        content: { id: "rem-005", title: "Check inventory" },
        startTime: "9:50 am", // Close to rem-004, will be grouped
      },
      {
        content: { id: "rem-006", title: "Lunch break" },
        startTime: "12:00 pm",
        endTime: "12:30 pm",
      },
      {
        content: { id: "rem-007", title: "Team meeting prep" },
        startTime: "2:00 pm",
      },
      {
        content: { id: "rem-008", title: "Review notes" },
        startTime: "2:10 pm", // Close to rem-007, will be grouped
      },
      {
        content: { id: "rem-009", title: "Call supplier" },
        startTime: "2:15 pm", // Also close, will be grouped with rem-007 and rem-008
      },
    ],
  };

  return (
    <View style={styles.container}>
      <CalendarComponent
        agendaData={sampleAgendaData}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onAppointmentPress={(appointment, groupId) =>
          setSelectedAppointment({
            type: AgendaSelectionType.Appointment,
            appointmentId: appointment.id,
            groupId,
          })
        }
        onEmptySlotPress={(groupId, slotNumber) =>
          setSelectedAppointment({
            type: AgendaSelectionType.EmptySlot,
            groupId,
            slotNumber,
          })
        }
        onReminderPress={(reminder) =>
          setSelectedAppointment({
            type: AgendaSelectionType.Reminder,
            reminderId: reminder.id,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
