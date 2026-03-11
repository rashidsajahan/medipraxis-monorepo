import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Icons } from "@/config";
import { useFetchGroupedReports } from "@/services/reports";
import { Color, Font, TextSize, TextVariant, textStyles } from "@repo/config";
import { Eye, FileImage, FilePdf } from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  type TextStyle as RNTextStyle,
} from "react-native";

// Text styles
const textLargeStyle = textStyles[TextVariant.Body][TextSize.Large];

type TabType = "completed" | "pending";

// Hardcoded user ID for now - TODO: Get from auth context
const TEMP_USER_ID = "2a3c19b8-d352-4b30-a2ac-1cdf993d310c";

export default function ReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("completed");

  // Fetch reports based on active tab
  const { data: groupedReports = [], isLoading } = useFetchGroupedReports(
    TEMP_USER_ID,
    activeTab === "completed"
  );

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time from ISO string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-white px-5 pt-5">
      {/* Header with Title and Button */}
      <View className="flex-row justify-between items-center mb-5">
        <TextComponent
          variant={TextVariant.Title}
          size={TextSize.Large}
          color={Color.Black}
        >
          Reports
        </TextComponent>

        <ButtonComponent
          size={ButtonSize.Medium}
          buttonColor={Color.Black}
          textColor={Color.White}
          onPress={() => {
            // TODO: Implement request report functionality
            console.log("Request Report pressed");
          }}
        >
          + Request Report
        </ButtonComponent>
      </View>

      {/* Search Bar */}
      <View className="mb-5">
        <Input
          variant="outline"
          size="md"
          style={{
            borderColor: Color.LightGrey,
            borderWidth: 1.5,
            borderRadius: 12,
            width: "100%",
            height: 56,
            backgroundColor: Color.White,
          }}
        >
          <InputField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
            placeholderTextColor={Color.Grey}
            style={{
              paddingLeft: 16,
              paddingRight: 48,
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
          <InputSlot className="pr-4">
            <Icons.Search size={20} color={Color.Grey} weight="regular" />
          </InputSlot>
        </Input>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center items-center mb-5 gap-4">
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          className="px-6 py-2 rounded-lg"
          style={{
            backgroundColor:
              activeTab === "completed" ? Color.Green : "transparent",
          }}
        >
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Medium}
            color={Color.Black}
          >
            Completed
          </TextComponent>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          className="px-6 py-2 rounded-lg"
          style={{
            backgroundColor:
              activeTab === "pending" ? Color.Green : "transparent",
          }}
        >
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Medium}
            color={Color.Black}
          >
            Pending
          </TextComponent>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 justify-center items-center pt-10">
            <ActivityIndicator size="large" color={Color.Green} />
          </View>
        ) : groupedReports.length === 0 ? (
          <View className="flex-1 justify-center items-center pt-10">
            <TextComponent
              variant={TextVariant.Body}
              size={TextSize.Medium}
              color={Color.Black}
              style={{ opacity: 0.5 }}
            >
              {activeTab === "completed"
                ? "No completed reports yet"
                : "No pending reports yet"}
            </TextComponent>
          </View>
        ) : (
          <View className="gap-4 pb-5">
            {groupedReports.map((group) => (
              <View
                key={group.client_id}
                className="bg-white rounded-2xl p-4 shadow-sm"
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                }}
              >
                {/* Header: Client Name and View Client Button */}
                <View className="flex-row justify-between items-center mb-3">
                  <TextComponent
                    variant={TextVariant.Title}
                    size={TextSize.Medium}
                    color={Color.Black}
                  >
                    {group.client_first_name} {group.client_last_name}
                  </TextComponent>

                  <TouchableOpacity
                    className="flex-row items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: Color.Black }}
                    onPress={() => {
                      // TODO: Navigate to client detail
                      console.log("View client:", group.client_id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Eye size={16} color={Color.White} weight="regular" />
                    <TextComponent
                      variant={TextVariant.Button}
                      size={TextSize.Small}
                      color={Color.White}
                    >
                      View Client
                    </TextComponent>
                  </TouchableOpacity>
                </View>

                {/* Reports List */}
                <View className="gap-2 mb-3">
                  {group.reports.map((report) => (
                    <View
                      key={report.report_id}
                      className="flex-row items-center gap-2"
                    >
                      {report.file_type === "PDF" ? (
                        <FilePdf
                          size={20}
                          color={Color.Black}
                          weight="regular"
                        />
                      ) : (
                        <FileImage
                          size={20}
                          color={Color.Black}
                          weight="regular"
                        />
                      )}
                      <TextComponent
                        variant={TextVariant.Body}
                        size={TextSize.Small}
                        color={Color.Black}
                      >
                        {report.report_title || "Untitled Report"}
                      </TextComponent>
                    </View>
                  ))}
                </View>

                {/* Footer: Date and Time */}
                <View
                  className="flex-row justify-between items-center pt-2 border-t-[1px]"
                  style={{ borderTopColor: "#E5E5E5" }}
                >
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                  >
                    {formatDate(group.report_date)}
                  </TextComponent>
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                  >
                    {formatTime(group.report_date)}
                  </TextComponent>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
