import { TextComponent } from "@/components/basic";
import { Color, TextSize, TextVariant } from "@repo/config";
import { Eye, FileImage, FilePdf } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export interface Report {
  report_id: string;
  report_title: string | null;
  file_path?: string | null;
  file_type?: string | null;
}

export interface ReportTileProps {
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  reportDate: string;
  reports: Report[];
  onViewClient?: (clientId: string) => void;
  onReportClick?: (reportId: string, filePath: string) => void;
}

export const ReportTile: React.FC<ReportTileProps> = ({
  clientId,
  clientFirstName,
  clientLastName,
  reportDate,
  reports,
  onViewClient,
  onReportClick,
}) => {
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
    <View
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
          {clientFirstName} {clientLastName}
        </TextComponent>

        <TouchableOpacity
          className="flex-row items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: Color.Black }}
          onPress={() => onViewClient?.(clientId)}
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
        {reports.map((report) => {
          // If report has file_path, show as clickable tile
          if (report.file_path) {
            return (
              <TouchableOpacity
                key={report.report_id}
                className="flex-row items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: "#F8F8F8",
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                }}
                onPress={() =>
                  onReportClick?.(report.report_id, report.file_path!)
                }
                activeOpacity={0.7}
              >
                {report.file_type === "PDF" ? (
                  <FilePdf size={24} color={Color.Black} weight="regular" />
                ) : (
                  <FileImage size={24} color={Color.Black} weight="regular" />
                )}
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Black}
                  style={{ flex: 1 }}
                >
                  {report.report_title || "Untitled Report"}
                </TextComponent>
              </TouchableOpacity>
            );
          }

          // For pending reports without file_path, show simple text
          return (
            <View key={report.report_id} className="flex-row items-center py-1">
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Small}
                color={Color.Black}
              >
                • {report.report_title || "Untitled Report"}
              </TextComponent>
            </View>
          );
        })}
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
          {formatDate(reportDate)}
        </TextComponent>
        <TextComponent
          variant={TextVariant.Body}
          size={TextSize.Small}
          color={Color.Grey}
        >
          {formatTime(reportDate)}
        </TextComponent>
      </View>
    </View>
  );
};
