import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { useFetchReportFile } from "@/services/reports";
import { Color, TextSize, TextVariant } from "@repo/config";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

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

  const {
    data: reportData,
    isLoading,
    error,
    refetch,
  } = useFetchReportFile(TEMP_USER_ID, id || "");

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
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color={Color.Green} />
        <TextComponent
          variant={TextVariant.Body}
          size={TextSize.Medium}
          color={Color.Grey}
          style={{ marginTop: 16 }}
        >
          Loading report...
        </TextComponent>
      </SafeAreaView>
    );
  }

  if (error || !reportData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-3">
          <View className="mb-6 self-start">
            <ButtonComponent.BackButton
              onPress={() => router.back()}
              size={ButtonSize.Small}
            />
          </View>
        </View>
        <View className="flex-1 justify-center items-center px-5">
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
            onPress={() => refetch()}
          >
            Retry
          </ButtonComponent>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-[#F5F5F5]">
        {/* Header Section */}
        <View className="px-5 pt-3 pb-6 bg-white">
          {/* Back Button */}
          <View className="mb-6 self-start">
            <ButtonComponent.BackButton
              onPress={() => router.back()}
              size={ButtonSize.Small}
            />
          </View>

          {/* Report Metadata */}
          <View className="gap-3">
            {/* Client Name */}
            <View>
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

            {/* Report Title */}
            <View>
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

            {/* Uploaded On */}
            <View>
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

            {/* Expires On */}
            {reportData.expiresIn && (
              <View>
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
            )}
          </View>
        </View>

        {/* Document Viewer */}
        <ScrollView
          className="flex-1 bg-[#F5F5F5]"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
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
                backgroundColor: Color.White,
                position: "relative",
              }}
            >
              <WebView
                source={{ uri: reportData.fileUrl }}
                onLoadStart={() => setDocumentLoading(true)}
                onLoadEnd={() => setDocumentLoading(false)}
                onError={() => {
                  setDocumentError(true);
                  setDocumentLoading(false);
                }}
                style={{ flex: 1, width: "100%" }}
                startInLoadingState={true}
                scalesPageToFit={true}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
