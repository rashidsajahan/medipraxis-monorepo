import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { ChipComponent, ChipVariant } from "@/components/basic/Chip.component";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Icons } from "@/config";
import { Color, Font, TextSize, TextVariant, textStyles } from "@repo/config";
import type { Client } from "@repo/models";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  type TextStyle as RNTextStyle,
} from "react-native";

// Tab options
enum ClientDetailTab {
  Appointments = "Appointments",
  Reports = "Reports",
}

// Props for the component
interface ViewClientProps {
  client: Client;
  visible: boolean;
  onClose: () => void;
  onViewProfile?: () => void;
  onShareCalendar?: () => void;
  onCall?: () => void;
}

// Text styles
const textLargeStyle = textStyles[TextVariant.Body][TextSize.Large];

export const ViewClient: React.FC<ViewClientProps> = ({
  client,
  visible,
  onClose,
  onViewProfile,
  onShareCalendar,
  onCall,
}) => {
  const [activeTab, setActiveTab] = useState<ClientDetailTab>(
    ClientDetailTab.Appointments
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Get full name - ensure it's never empty
  const fullName =
    `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Unknown";
  const age = calculateAge(client.date_of_birth);

  // Check if client has allergies (example: checking known_conditions)
  // Add proper type checking and validation
  const hasAllergies =
    client.known_conditions &&
    Array.isArray(client.known_conditions) &&
    client.known_conditions.length > 0 &&
    client.known_conditions[0];

  const allergyText =
    hasAllergies && client.known_conditions?.[0]
      ? String(client.known_conditions[0])
      : null;

  // Determine title prefix
  const titlePrefix =
    client.gender === "MALE" ? "Mr" : client.gender === "FEMALE" ? "Ms" : "";
  const displayName = titlePrefix ? `${titlePrefix} ${fullName}` : fullName;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.White }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            {/* Header Section */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 24,
                backgroundColor: Color.White,
              }}
            >
              {/* Back Button */}
              <View style={{ marginBottom: 24, alignSelf: "flex-start" }}>
                <ButtonComponent.BackButton
                  onPress={onClose}
                  size={ButtonSize.Small}
                />
              </View>

              {/* Patient Info Section */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    backgroundColor: "#E8F5A8",
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* Placeholder avatar - you can replace with actual image */}
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icons.User size={40} color={Color.Grey} />
                  </View>
                </View>

                {/* Patient Details */}
                <View style={{ flex: 1 }}>
                  <TextComponent
                    variant={TextVariant.Title}
                    size={TextSize.Medium}
                    style={{ marginBottom: 4 }}
                  >
                    {displayName}
                  </TextComponent>
                  {age !== null && (
                    <TextComponent
                      variant={TextVariant.Body}
                      size={TextSize.Small}
                      color={Color.Grey}
                      style={{ marginBottom: 8 }}
                    >
                      {age} years old
                    </TextComponent>
                  )}
                  {allergyText && (
                    <ChipComponent
                      text={allergyText}
                      variant={ChipVariant.Danger}
                    />
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <ButtonComponent
                  size={ButtonSize.Small}
                  leftIcon={Icons.Eye}
                  buttonColor={Color.Black}
                  textColor={Color.White}
                  iconColor={Color.White}
                  onPress={onViewProfile}
                >
                  Profile
                </ButtonComponent>

                <ButtonComponent
                  size={ButtonSize.Small}
                  leftIcon={Icons.ShareNetwork}
                  buttonColor={Color.Black}
                  textColor={Color.White}
                  iconColor={Color.White}
                  onPress={onShareCalendar}
                >
                  Share Calendar
                </ButtonComponent>

                <ButtonComponent
                  size={ButtonSize.Small}
                  leftIcon={Icons.Phone}
                  buttonColor={Color.Black}
                  textColor={Color.White}
                  iconColor={Color.White}
                  onPress={onCall}
                >
                  Call
                </ButtonComponent>
              </View>
            </View>

            {/* Tab Section */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                backgroundColor: "#F5F5F5",
              }}
            >
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                {/* Appointments Tab */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 9999,
                    backgroundColor:
                      activeTab === ClientDetailTab.Appointments
                        ? Color.Green
                        : "transparent",
                  }}
                  onPress={() => setActiveTab(ClientDetailTab.Appointments)}
                  activeOpacity={0.7}
                >
                  <TextComponent
                    variant={TextVariant.Button}
                    size={TextSize.Medium}
                    color={Color.Black}
                  >
                    Appointments
                  </TextComponent>
                </TouchableOpacity>

                {/* Reports Tab */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 9999,
                    backgroundColor:
                      activeTab === ClientDetailTab.Reports
                        ? Color.Green
                        : "transparent",
                  }}
                  onPress={() => setActiveTab(ClientDetailTab.Reports)}
                  activeOpacity={0.7}
                >
                  <TextComponent
                    variant={TextVariant.Button}
                    size={TextSize.Medium}
                    color={Color.Black}
                  >
                    Reports
                  </TextComponent>
                </TouchableOpacity>

                {/* More Options Button */}
                <TouchableOpacity
                  style={{
                    marginLeft: "auto",
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Icons.DotsThreeVertical
                    size={20}
                    color={Color.Black}
                    weight="bold"
                  />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={{ marginBottom: 16 }}>
                <Input
                  variant="outline"
                  size="md"
                  style={{
                    borderColor: Color.LightGrey,
                    borderWidth: 1,
                    borderRadius: 12,
                    width: "100%",
                    height: 50,
                    backgroundColor: Color.White,
                  }}
                >
                  <InputSlot className="pl-4">
                    <Icons.MagnifyingGlass
                      size={18}
                      color={Color.Grey}
                      weight="regular"
                    />
                  </InputSlot>
                  <InputField
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search"
                    placeholderTextColor={Color.Grey}
                    style={{
                      paddingLeft: 12,
                      paddingRight: 16,
                      paddingVertical: 12,
                      fontFamily:
                        textLargeStyle.fontFamily === Font.DMsans
                          ? "DMSans_400Regular"
                          : "Lato_400Regular",
                      fontSize: textLargeStyle.fontSize,
                      fontWeight: "400" as RNTextStyle["fontWeight"],
                      textAlign: "left",
                      color: Color.Black,
                    }}
                  />
                </Input>
              </View>
            </View>

            {/* Content Section */}
            <ScrollView
              style={{
                flex: 1,
                paddingHorizontal: 20,
                backgroundColor: "#F5F5F5",
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
            >
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 80,
                  }}
                >
                  <ActivityIndicator size="large" color={Color.Green} />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {activeTab === ClientDetailTab.Appointments ? (
                    <View>
                      {/* Appointments content would go here */}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 80,
                        }}
                      >
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
                    </View>
                  ) : (
                    <View>
                      {/* Reports content would go here */}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 80,
                        }}
                      >
                        <Icons.FileText
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
                          No reports found
                        </TextComponent>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
