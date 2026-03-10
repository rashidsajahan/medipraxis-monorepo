import { ImageBackground } from "react-native";

export default function HomeCard() {
  return (
    <ImageBackground
      source={require("@/assets/images/home/card-background.png")}
      style={{ width: "100%", height: 220 }}
      imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      resizeMode="cover"
    />
  );
}
