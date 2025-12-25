import TextComponent from "@/components/basic";
import { Color, TextSize, TextVariant } from "@repo/config";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { AgendaReminderContent } from "./calendar.types";

interface AgendaReminderModalProps {
  visible: boolean;
  onClose: () => void;
  reminders: Array<{ content: AgendaReminderContent }>;
  onReminderPress?: (reminder: AgendaReminderContent) => void;
}

export function AgendaReminderModal({
  visible,
  onClose,
  reminders,
  onReminderPress,
}: AgendaReminderModalProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            width: "85%",
            height: "70%",
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <TextComponent size={TextSize.Medium} variant={TextVariant.Title}>
              Tasks
            </TextComponent>
            <TextComponent
              size={TextSize.Small}
              variant={TextVariant.Body}
              color={Color.Grey}
            >
              {reminders.length} task{reminders.length !== 1 ? "s" : ""}
            </TextComponent>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={true}
          >
            {reminders.map((reminder, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onReminderPress?.(reminder.content);
                  onClose();
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                  backgroundColor: Color.LightGreen,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderColor: Color.Green,
                }}
              >
                <TextComponent
                  size={TextSize.Small}
                  variant={TextVariant.Title}
                >
                  {reminder.content.title}
                </TextComponent>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={{
              marginTop: 16,
              backgroundColor: Color.Green,
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <TextComponent
              size={TextSize.Small}
              variant={TextVariant.Title}
              color={Color.White}
            >
              Close
            </TextComponent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
