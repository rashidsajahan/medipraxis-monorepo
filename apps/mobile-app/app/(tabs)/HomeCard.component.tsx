import { Ionicons } from "@expo/vector-icons";
import { Color, TextSize, TextVariant, textStyles } from "@repo/config";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

function applyTextStyle(variant: TextVariant, size: TextSize) {
  const style =
    textStyles[variant][size as keyof (typeof textStyles)[typeof variant]];

  const fontFamilyMap: Record<string, string> = {
    lato: "Lato",
    dm_sans: "DMSans",
  };

  return {
    fontFamily: fontFamilyMap[style.fontFamily] ?? undefined,
    fontSize: style.fontSize,
    fontWeight: String(style.fontWeight) as any,
    fontStyle: style.fontStyle as any,
    ...(style.lineHeight && { lineHeight: style.lineHeight }),
    ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
  };
}

interface HomeCardProps {
  name?: string;
  notificationCount?: number;
  appointmentCount?: number;
  taskCount?: number;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export default function HomeCard({
  name = "Katherine",
  notificationCount = 8,
  appointmentCount = 15,
  taskCount = 7,
  onNotificationPress,
  onSettingsPress,
}: HomeCardProps) {
  return (
    <ImageBackground
      source={require("@/assets/images/home/card-background.png")}
      style={{ width: "100%", height: 300 }}
      imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      resizeMode="cover"
    >
      {/* Date + Icons Row */}
      <View className="flex-row justify-between items-center px-5 pt-5">
        <Text style={{ color: Color.Black, fontSize: 14, fontWeight: "500" }}>
          {getFormattedDate()}
        </Text>

        <View className="flex-row items-center gap-3">
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

          <TouchableOpacity onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={22} color={Color.Black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting + Name */}
      <View className="px-5 pt-3">
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

      {/* Stats Cards Row */}
      <View className="flex-row px-5 gap-3 mt-5">
        {/* Appointments Card */}
        <View
          className="flex-1 rounded-2xl overflow-hidden justify-center items-center py-4"
          style={{ backgroundColor: Color.LightCream, minHeight: 120 }}
        >
          <Image
            source={require("@/assets/images/home/appointment.png")}
            style={{
              position: "absolute",
              left: -8,
              bottom: -8,
              width: 110,
              height: 110,
              opacity: 1,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              ...applyTextStyle(TextVariant.Title, TextSize.Small),
              color: Color.Black,
              textAlign: "center",
            }}
          >
            APPOINTMENTS
          </Text>
          <Text
            style={{
              ...applyTextStyle(TextVariant.Title, TextSize.Large),
              color: Color.Black,
              textAlign: "center",
              lineHeight: 36,
            }}
          >
            {String(appointmentCount).padStart(2, "0")}
          </Text>
        </View>

        {/* Tasks Card */}
        <View
          className="flex-1 rounded-2xl overflow-hidden justify-center items-center py-4"
          style={{ backgroundColor: Color.LightCream, minHeight: 120 }}
        >
          <Image
            source={require("@/assets/images/home/tasks.png")}
            style={{
              position: "absolute",
              right: -8,
              top: -8,
              width: 110,
              height: 110,
              opacity: 1,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              ...applyTextStyle(TextVariant.Title, TextSize.Small),
              color: Color.Black,
              textAlign: "center",
            }}
          >
            TASKS
          </Text>
          <Text
            style={{
              ...applyTextStyle(TextVariant.Title, TextSize.Large),
              color: Color.Black,
              textAlign: "center",
              lineHeight: 36,
            }}
          >
            {String(taskCount).padStart(2, "0")}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
