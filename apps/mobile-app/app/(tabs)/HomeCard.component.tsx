import { Ionicons } from "@expo/vector-icons";
import { Color } from "@repo/config";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import {
  Defs,
  LinearGradient,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";

function getFormattedDate(): string {
  const today = new Date();
  const day = today.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  return `${day}${suffix} ${month}, ${weekday}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}

interface HomeCardProps {
  name?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export default function HomeCard({
  name = "Katherine",
  notificationCount = 8,
  onNotificationPress,
  onSettingsPress,
}: HomeCardProps) {
  return (
    <ImageBackground
      source={require("@/assets/images/home/card-background.png")}
      style={{ width: "100%", height: 240 }}
      imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      resizeMode="cover"
    >
      {/* Date + Icons Row */}
      <View className="flex-row justify-between items-center px-5 pt-5">
        {/* Date */}
        <Text style={{ color: Color.Black, fontSize: 14, fontWeight: "500" }}>
          {getFormattedDate()}
        </Text>

        {/* Icons */}
        <View className="flex-row items-center gap-3">
          {/* Notification Bell */}
          <TouchableOpacity onPress={onNotificationPress} className="relative">
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Color.Black}
            />
            {notificationCount > 0 && (
              <View
                className="absolute -top-1 -right-1 rounded-full min-w-4 h-4 justify-center items-center px-1"
                style={{ backgroundColor: Color.Danger }}
              >
                <Text
                  style={{ color: Color.White, fontSize: 9, fontWeight: "700" }}
                >
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={22} color={Color.Black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting + Name */}
      <View className="px-5 pt-6">
        <Text style={{ color: Color.Black, fontSize: 32, fontWeight: "700" }}>
          {getGreeting()}
        </Text>

        <Svg height={56} width="100%">
          <Defs>
            <LinearGradient id="nameGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={Color.TextGreen} />
              <Stop offset="0.5" stopColor={Color.Green} />
              <Stop offset="1" stopColor={Color.TextGreen} />
            </LinearGradient>
          </Defs>
          <SvgText
            fill="url(#nameGradient)"
            fontSize={44}
            fontWeight="800"
            fontStyle="italic"
            x="0"
            y="48"
          >
            {name}
          </SvgText>
        </Svg>
      </View>
    </ImageBackground>
  );
}
