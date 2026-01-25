import { Text, View } from "@/components/Themed";
import { Icons } from "@/config";
import { Modal, Pressable, ScrollView, StyleSheet } from "react-native";

interface AppointmentData {
  title: string;
  slotWindow: string;
  slotNo: number;
  location: string;
  client: string;
  start_date: string;
  end_date: string;
  note: string;
}

interface ViewAppointmentModalProps {
  visible: boolean;
  data: AppointmentData;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
}

export const ViewAppointmentModal = ({
  visible,
  data,
  onClose,
  onEdit,
  onCancel,
}: ViewAppointmentModalProps) => {
  const handleEdit = () => {
    onEdit?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.cardContainer}>
          {/* Scrollable Content Area */}
          <ScrollView
            contentContainerStyle={styles.cardContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.headerTitle}>{data.title}</Text>

            {/* Row 1: Slot Window & Slot No */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Slot Window</Text>
                <View style={[styles.inputContainer, styles.dropdown]}>
                  <Text style={styles.inputText}>{data.slotWindow}</Text>
                  <Icons.CaretDown size={16} color="#6B7280" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Slot No.</Text>
                <View style={[styles.inputContainer, styles.dropdown]}>
                  <Text style={styles.inputText}>{data.slotNo}</Text>
                  <Icons.CaretDown size={16} color="#6B7280" />
                </View>
              </View>
            </View>

            {/* Client Details */}
            <Text style={styles.label}>Client Details</Text>
            <View style={[styles.inputContainer, styles.dropdown]}>
              <Text style={styles.inputText}>{data.client}</Text>
              <Icons.CaretDown size={16} color="#6B7280" />
            </View>

            {/* Start Date */}
            <Text style={styles.label}>Start Date & time</Text>
            <View style={styles.inputContainer}>
              <Icons.CalendarDotsIcon
                size={20}
                color="#4B5563"
                weight="bold"
                style={styles.iconLeft}
              />
              <Text style={styles.inputText}>{data.start_date}</Text>
            </View>

            {/* End Date */}
            <Text style={styles.label}>End Date & time</Text>
            <View style={styles.inputContainer}>
              <Icons.CalendarDotsIcon
                size={20}
                color="#4B5563"
                weight="bold"
                style={styles.iconLeft}
              />
              <Text style={styles.inputText}>{data.end_date}</Text>
            </View>

            {/* Note */}
            <Text style={styles.label}>Note</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Text style={styles.noteText}>{data.note}</Text>
            </View>
          </ScrollView>

          {/* Footer Action Bar */}
          <View style={styles.footer}>
            <Pressable style={styles.editButton} onPress={handleEdit}>
              <Icons.Pencil size={18} color="white" weight="bold" />
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Icons.Trash size={18} color="white" weight="bold" />
              <Text style={styles.buttonText}>Cancel Appointment</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: "85%",
  },
  cardContent: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    fontFamily: "System",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dropdown: {
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  iconLeft: {
    marginRight: 10,
  },
  textAreaContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  noteText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  footer: {
    backgroundColor: "#EAF8C9",
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
