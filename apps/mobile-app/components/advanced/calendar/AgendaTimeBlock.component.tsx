import TextComponent from "@/components/basic";
import { timeToDecimalHour } from "@/utils";
import { TextSize, TextVariant } from "@repo/config";
import { Pressable, useWindowDimensions } from "react-native";
import { HOUR_HEIGHT } from "./calendar.constants";
import { AgendaBlockContent } from "./calendar.types";

interface AgendaTimeBlockProps {
  content: AgendaBlockContent;
  startTime: string;
  endTime: string;
  bgColor?: string;
  borderColor?: string;
  onPress?: (appointment: AgendaBlockContent, groupId: string | null) => void;
}

export function AgendaTimeBlock({
  content,
  startTime,
  endTime,
  bgColor = "#E3F2FD",
  borderColor = "#2196F3",
  onPress,
}: AgendaTimeBlockProps): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();
  const startHourDecimal = timeToDecimalHour(startTime);
  const endHourDecimal = timeToDecimalHour(endTime);
  const height = (endHourDecimal - startHourDecimal) * HOUR_HEIGHT;
  const topPosition = startHourDecimal * HOUR_HEIGHT;

  // Calculate width for left column (appointments) - 75% of available space
  const LEFT_MARGIN = 60;
  const RIGHT_MARGIN = 16;
  const availableWidth = screenWidth - LEFT_MARGIN - RIGHT_MARGIN;
  const columnWidth = availableWidth * 0.7;

  return (
    <Pressable
      onPress={() => onPress?.(content, null)}
      className="absolute flex flex-row items-center gap-2 border border-l-4 pl-4"
      style={{
        height,
        top: topPosition,
        left: LEFT_MARGIN,
        width: columnWidth,
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <TextComponent
        size={TextSize.Small}
        variant={TextVariant.Body}
        numberOfLines={1}
      >
        {content.title}
      </TextComponent>
      {content.client && (
        <TextComponent
          size={TextSize.Small}
          variant={TextVariant.Body}
          numberOfLines={1}
        >
          #{content.client}
        </TextComponent>
      )}
    </Pressable>
  );
}
