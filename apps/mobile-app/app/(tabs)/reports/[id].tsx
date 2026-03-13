import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { useFetchReportFile } from "@/services/reports";
import { Color, TextSize, TextVariant } from "@repo/config";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CalendarBlankIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
} from "phosphor-react-native";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const TEMP_USER_ID = "2a3c19b8-d352-4b30-a2ac-1cdf993d310c";

export default function ReportViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: reportData, isLoading, error } = useFetchReportFile(
    TEMP_USER_ID,
    id || ""
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewReport = async () => {
    if (reportData?.fileUrl) {
      await WebBrowser.openBrowserAsync(reportData.fileUrl, {
        presentationStyle:
          WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: Color.Green,
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color={Color.Green} />
        <TextComponent
          variant={TextVariant.Body}
          size={TextSize.Medium}
          color={Color.Grey}
          style={{ marginTop: 16 }}
        >
          Loading report...
        </TextComponent>
      </View>
    );
  }

  if (error || !reportData) {
    return (
      <View className="flex-1 bg-white px-5 pt-5">
        <View className="flex-1 justify-center items-center">
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Medium}
            color={Color.Danger}
            style={{ marginBottom: 16, textAlign: "center" }}
          >
            Failed to load report. Please try again.
          </TextComponent>
          <ButtonComponent
            size={ButtonSize.Medium}
            buttonColor={Color.Black}
            textColor={Color.White}
            onPress={() => router.back()}
          >
            Go Back
          </ButtonComponent>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-5 pb-10">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <ButtonComponent
            size={ButtonSize.Small}
            buttonColor={Color.LightGrey}
            textColor={Color.Black}
            onPress={() => router.back()}
          >
            ← Back
          </ButtonComponent>
          <TextComponent
            variant={TextVariant.Title}
            size={TextSize.Large}
            color={Color.Black}
            style={{ marginLeft: 16 }}
          >
            Report Details
          </TextComponent>
        </View>

        {/* Metadata Cards */}
        <View className="gap-4 mb-6">
          {/* Client Name */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5]">
            <View className="flex-row items-center gap-3">
              <UserIcon size={24} color={Color.Green} weight="regular" />
              <View className="flex-1">
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Grey}
                  style={{ marginBottom: 4 }}
                >
                  Client Name
                </TextComponent>
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Medium}
                  color={Color.Black}
                >
                  {reportData.clientName}
                </TextComponent>
              </View>
            </View>
          </View>

          {/* Report Title */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5]">
            <View className="flex-row items-center gap-3">
              <FileTextIcon size={24} color={Color.Green} weight="regular" />
              <View className="flex-1">
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Grey}
                  style={{ marginBottom: 4 }}
                >
                  Report Title
                </TextComponent>
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Medium}
                  color={Color.Black}
                >
                  {reportData.reportTitle || "Untitled Report"}
                </TextComponent>
              </View>
            </View>
          </View>

          {/* Uploaded On */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5]">
            <View className="flex-row items-center gap-3">
              <CalendarBlankIcon size={24} color={Color.Green} weight="regular" />
              <View className="flex-1">
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Grey}
                  style={{ marginBottom: 4 }}
                >
                  Uploaded On
                </TextComponent>
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Medium}
                  color={Color.Black}
                >
                  {formatDateTime(reportData.uploadedOn)}
                </TextComponent>
              </View>
            </View>
          </View>

          {/* Expires In */}
          {reportData.expiresIn && (
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5]">
              <View className="flex-row items-center gap-3">
                <ClockIcon size={24} color={Color.Green} weight="regular" />
                <View className="flex-1">
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                    style={{ marginBottom: 4 }}
                  >
                    Expires On
                  </TextComponent>
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Medium}
                    color={Color.Black}
                  >
                    {formatDate(reportData.expiresIn)}
                  </TextComponent>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* View Report Button */}
        <ButtonComponent
          size={ButtonSize.Large}
          buttonColor={Color.Green}
          textColor={Color.Black}
          onPress={handleViewReport}
        >
          View Report
        </ButtonComponent>
      </View>
    </ScrollView>
  );
}
