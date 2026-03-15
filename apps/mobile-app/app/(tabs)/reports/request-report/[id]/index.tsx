import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Icons, type Icon } from "@/config";
import { useFetchClients } from "@/services/clients";
import { Color, TextSize, TextVariant } from "@repo/config";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AtIcon,
  ChatCircleTextIcon,
  CheckIcon,
  WhatsappLogoIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

const TEMP_USER_ID = "2a3c19b8-d352-4b30-a2ac-1cdf993d310c";

const REQUEST_REPORT_FORM = {
  description: "",
  form_structure: [
    {
      field_type: "upload-attachment",
      display_label: "ECG Report",
      description: "",
      help_text: "",
      active: false,
      required: true,
      shareable: false,
      sequence: 1,
    },
    {
      field_type: "upload-attachment",
      display_label: "X-Ray of Arm",
      description: "",
      help_text: "",
      active: false,
      required: true,
      shareable: false,
      sequence: 2,
    },
    {
      field_type: "upload-attachment",
      display_label: "Vitamin D Report",
      description: "",
      help_text: "",
      active: false,
      required: true,
      shareable: false,
      sequence: 3,
    },
  ],
};

type SendThroughOption = "whatsapp" | "message" | "email";

const SEND_THROUGH_OPTIONS: {
  key: SendThroughOption;
  label: string;
  Icon: Icon;
}[] = [
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsappLogoIcon },
  { key: "message", label: "Message", Icon: ChatCircleTextIcon },
  { key: "email", label: "Email", Icon: AtIcon },
];

type RequestReportForm = typeof REQUEST_REPORT_FORM;

export default function RequestReportScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: clients = [], isLoading: isClientsLoading } =
    useFetchClients(TEMP_USER_ID);
  const [requestReportForm, setRequestReportForm] =
    useState<RequestReportForm>(REQUEST_REPORT_FORM);
  const [selectedSendThrough, setSelectedSendThrough] = useState<
    SendThroughOption[]
  >([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const sortedFormFields = [...requestReportForm.form_structure].sort(
    (a, b) => a.sequence - b.sequence
  );

  const selectedClient =
    typeof id === "string" ? clients.find((client) => client.id === id) : null;
  const displayClientName = isClientsLoading
    ? "Loading client..."
    : selectedClient?.name || "Unknown Client";

  const toggleReport = (reportType: string) => {
    setRequestReportForm((previous) => ({
      ...previous,
      form_structure: previous.form_structure.map((field) =>
        field.display_label === reportType
          ? { ...field, active: !field.active }
          : field
      ),
    }));
  };

  const toggleSendThrough = (option: SendThroughOption) => {
    setSelectedSendThrough((previous) =>
      previous.includes(option)
        ? previous.filter((item) => item !== option)
        : [...previous, option]
    );
  };

  const handleRequest = () => {
    const requestPayload = {
      ...requestReportForm,
      additional_notes: additionalNotes,
      send_through: selectedSendThrough,
    };

    console.log("Request report payload:", JSON.stringify(requestPayload, null, 2));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-3 pb-6 bg-white">
          <View className="mb-6 self-start">
            <ButtonComponent.BackButton
              onPress={() => router.back()}
              size={ButtonSize.Small}
            />
          </View>

          <TextComponent
            variant={TextVariant.Title}
            size={TextSize.Large}
            color={Color.Black}
            className="mb-5"
          >
            Requesting Reports
          </TextComponent>

          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-[#E8F5A8] justify-center items-center overflow-hidden">
              <Icons.User size={20} color={Color.Grey} />
            </View>
            <TextComponent
              variant={TextVariant.Body}
              size={TextSize.Medium}
              color={Color.Black}
            >
              from {displayClientName}
            </TextComponent>
          </View>
        </View>

        <View className="px-5 pt-2">
          <TextComponent
            variant={TextVariant.Title}
            size={TextSize.Medium}
            color={Color.Black}
            className="mb-3"
          >
            Reports
          </TextComponent>

          <View className="mb-6 gap-3">
            {sortedFormFields.map((field) => (
              <Checkbox
                key={`${field.sequence}-${field.display_label}`}
                size="md"
                value={field.display_label}
                isChecked={field.active}
                onChange={() => toggleReport(field.display_label)}
                className="items-center"
              >
                <CheckboxIndicator className="mr-3 border-[#D4D4D4] data-[checked=true]:bg-[#84CC16] data-[checked=true]:border-[#84CC16]">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="text-[#111827]">
                  {field.display_label}
                </CheckboxLabel>
              </Checkbox>
            ))}
          </View>

          <TextComponent
            variant={TextVariant.Title}
            size={TextSize.Medium}
            color={Color.Black}
            className="mb-3"
          >
            Additional Notes
          </TextComponent>

          <View className="mb-6 rounded-xl border border-[#D4D4D4] p-3">
            <TextInput
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              textAlignVertical="top"
              placeholder="Type additional notes here..."
              placeholderTextColor={Color.Grey}
              className="min-h-[120px] text-black"
            />
          </View>

          <TextComponent
            variant={TextVariant.Button}
            size={TextSize.Medium}
            color={Color.Black}
            className="mb-3"
          >
            Send through
          </TextComponent>

          <View className="mb-8 flex-row items-stretch gap-3">
            {SEND_THROUGH_OPTIONS.map((option) => {
              const isSelected = selectedSendThrough.includes(option.key);
              const IconComponent = option.Icon;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => toggleSendThrough(option.key)}
                  activeOpacity={0.8}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border px-3 py-3 ${isSelected ? "border-[#84CC16] bg-[#84CC16]" : "border-[#D4D4D4] bg-[#F5F5F5]"}`}
                >
                  <IconComponent
                    size={18}
                    color={isSelected ? Color.Black : Color.Grey}
                    weight="regular"
                  />
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Black}
                  >
                    {option.label}
                  </TextComponent>
                </TouchableOpacity>
              );
            })}
          </View>

          <ButtonComponent
            size={ButtonSize.Medium}
            buttonColor={Color.Black}
            textColor={Color.White}
            onPress={handleRequest}
          >
            Request
          </ButtonComponent>

          <View className="h-24" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
