import TextComponent from "@/components/basic";
import { parseTimeToMinutes } from "@/utils";
import { Color, TextSize, TextVariant } from "@repo/config";
import { Pressable, useWindowDimensions } from "react-native";
import { HOUR_HEIGHT } from "./calendar.constants";
import { AgendaReminderContent } from "./calendar.types";

interface AgendaReminderBlockProps {
  content: AgendaReminderContent;
  startTime: string;
  endTime?: string;
  onPress?: (reminder: AgendaReminderContent) => void;
}

export function AgendaReminderBlock({
  content,
  startTime,
  endTime,
  onPress,
}: AgendaReminderBlockProps): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();

  // If no endTime, default to 30 minutes from startTime
  // Ensure minimum duration of 30 minutes even when endTime is provided
  const startTimeMinutes = parseTimeToMinutes(startTime);
  const calculatedEndTimeMinutes = endTime
    ? parseTimeToMinutes(endTime)
    : startTimeMinutes + 30;

  // Enforce minimum 30 minute duration
  const endTimeMinutes = Math.max(
    calculatedEndTimeMinutes,
    startTimeMinutes + 30
  );

  const startHourDecimal = startTimeMinutes / 60;
  const endHourDecimal = endTimeMinutes / 60;

  const height = (endHourDecimal - startHourDecimal) * HOUR_HEIGHT;
  const topPosition = startHourDecimal * HOUR_HEIGHT;

  // Calculate position for right column (30% of available space)
  const LEFT_MARGIN = 60;
  const RIGHT_MARGIN = 16;
  const availableWidth = screenWidth - LEFT_MARGIN - RIGHT_MARGIN;
  const leftColumnWidth = availableWidth * 0.7;
  const columnWidth = availableWidth * 0.3;
  const leftPosition = LEFT_MARGIN + leftColumnWidth;

  return (
    <Pressable
      onPress={() => onPress?.(content)}
      className="px-1"
      style={{
        position: "absolute",
        height,
        top: topPosition,
        left: leftPosition,
        width: columnWidth,
        backgroundColor: Color.LightGreen,
        borderColor: Color.Green,
        borderWidth: 1,
        justifyContent: "center",
      }}
    >
      <TextComponent
        size={TextSize.Small}
        variant={TextVariant.Body}
        numberOfLines={2}
      >
        {content.title}
      </TextComponent>
    </Pressable>
  );
}
