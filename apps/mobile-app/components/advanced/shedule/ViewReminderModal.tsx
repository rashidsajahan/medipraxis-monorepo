import {
  TextInputComponent,
  ToggleButton,
  ToggleSize,
} from "@/components/basic";
import { Text } from "@/components/Themed";
import { Icons } from "@/config";
import { formatISOToSimple } from "@/utils/timeUtils";
import { TaskDetails } from "@repo/models";
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ViewReminderModalProps {
  visible: boolean;
  data: TaskDetails;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

export const ViewReminderModal = ({
  visible,
  data,
  onClose,
  onEdit,
  onCancel,
  readOnly = false,
}: ViewReminderModalProps) => {
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
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/40 p-5">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-[400px] bg-white rounded-2xl overflow-hidden shadow-md max-h-[85%]">
              {/* Scrollable Content Area */}
              <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
                showsVerticalScrollIndicator={true}
              >
                <Text className="text-xl font-bold text-black mb-5">
                  {data?.task_title}dggggggggggg
                </Text>

                {/* Date */}
                <View className="flex-row justify-between mb-4">
                  <TextInputComponent
                    label="Date & time"
                    startIcon={
                      <Icons.CalendarDotsIcon
                        size={20}
                        weight="bold"
                        color="#4B5563"
                      />
                    }
                    inputField={{
                      placeholder: "Enter Date & time",
                      value: formatISOToSimple(data?.start_date),
                      onChangeText: () => {},
                    }}
                    inputWrapper={{
                      accessibilityHint: "Enter Date & time",
                      isDisabled: readOnly,
                    }}
                  />
                </View>

                {/* Set Alarm */}
                <View className="flex-row justify-between mb-4">
                  <ToggleButton
                    size={ToggleSize.Medium}
                    label="Alarm"
                    isActive={data?.set_alarm ?? false}
                  />
                </View>

                {/* Note */}
                <View className="flex-row justify-between mb-4">
                  <TextInputComponent
                    inputWrapper={{
                      accessibilityHint: "Enter your note",
                    }}
                    inputField={{
                      value: data?.note ?? undefined,
                      onChangeText: () => {},
                      placeholder: "Enter note",
                    }}
                    label="Note"
                  />
                </View>
              </ScrollView>

              {/* Footer Action Bar */}
              <View className="bg-[#EAF8C9] p-4 flex-row justify-end gap-x-2.5 border-t border-gray-100">
                <Pressable
                  className="flex-row items-center bg-slate-900 py-2.5 px-4 rounded-lg gap-x-2"
                  onPress={handleEdit}
                >
                  <Icons.Pencil size={18} color="white" weight="bold" />
                  <Text
                    darkColor="white"
                    lightColor="white"
                    className=" font-semibold text-sm"
                  >
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  className="flex-row items-center bg-[#FF5A5F] py-2.5 px-4 rounded-lg gap-x-2"
                  onPress={handleCancel}
                >
                  <Icons.Trash size={18} color="white" weight="bold" />
                  <Text
                    darkColor={"white"}
                    lightColor="white"
                    className="font-semibold text-sm"
                  >
                    Cancel Reminder
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
