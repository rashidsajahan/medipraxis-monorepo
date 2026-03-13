import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { useFetchReportFile } from "@/services/reports";
import { Color, TextSize, TextVariant } from "@repo/config";
import { ExpoPdfReaderView } from "@june24/expo-pdf-reader";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CalendarBlankIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, View } from "react-native";

const TEMP_USER_ID = "2a3c19b8-d352-4b30-a2ac-1cdf993d310c";

const isPDF = (fileType: string | null) => {
  return (
    fileType?.toLowerCase() === "pdf" ||
    fileType?.toLowerCase() === "application/pdf"
  );
};

const isImage = (fileType: string | null) => {
  return (
    fileType?.toLowerCase().includes("image") ||
    ["jpg", "jpeg", "png"].includes(fileType?.toLowerCase() || "")
  );
};

export default function ReportViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState(false);

  const { data: reportData, isLoading, error, refetch } = useFetchReportFile(
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

        {/* Document Viewer */}
        <View className="mt-4">
          {documentError ? (
            <View className="p-6 bg-red-50 rounded-lg items-center">
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Medium}
                color={Color.Danger}
                style={{ marginBottom: 16, textAlign: "center" }}
              >
                Failed to load document. The link may have expired.
              </TextComponent>
              <ButtonComponent
                size={ButtonSize.Medium}
                buttonColor={Color.Black}
                textColor={Color.White}
                onPress={() => {
                  setDocumentError(false);
                  setDocumentLoading(true);
                  refetch();
                }}
              >
                Retry
              </ButtonComponent>
            </View>
          ) : reportData.fileType && isPDF(reportData.fileType) ? (
            <View
              style={{
                height: Dimensions.get("window").height * 0.6,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: Color.LightGrey,
                position: "relative",
              }}
            >
              <ExpoPdfReaderView
                style={{ flex: 1, width: "100%" }}
                url={reportData.fileUrl}
              />
              {documentLoading && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <ActivityIndicator size="large" color={Color.Green} />
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                    style={{ marginTop: 8 }}
                  >
                    Loading PDF...
                  </TextComponent>
                </View>
              )}
            </View>
          ) : reportData.fileType && isImage(reportData.fileType) ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: reportData.fileUrl }}
                style={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.5,
                  borderRadius: 12,
                }}
                resizeMode="contain"
                onLoadStart={() => setDocumentLoading(true)}
                onLoadEnd={() => setDocumentLoading(false)}
                onError={() => {
                  setDocumentError(true);
                  setDocumentLoading(false);
                }}
              />
              {documentLoading && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <ActivityIndicator size="large" color={Color.Green} />
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                    style={{ marginTop: 8 }}
                  >
                    Loading image...
                  </TextComponent>
                </View>
              )}
            </View>
          ) : (
            <View className="p-4 bg-gray-100 rounded-lg">
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Small}
                color={Color.Grey}
              >
                Unable to display this file type
              </TextComponent>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
