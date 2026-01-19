import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  View,
  type ImageSourcePropType,
} from "react-native";

const botAvatarClosed =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/assets/images/ai/bot-eye-closed.png") as ImageSourcePropType;

interface AIAssistantButtonProps {
  onPress: () => void;
}

export function AIAssistantButton({
  onPress,
}: AIAssistantButtonProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [floatAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <View className="absolute bottom-24 right-6 z-50">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          className="w-20 h-20 bg-mp-white rounded-full justify-center items-center shadow-lg border-2 border-mp-green"
          style={{
            transform: [{ scale: scaleAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 4,
          }}
        >
          <Animated.Image
            source={botAvatarClosed}
            style={{
              width: 50,
              height: 50,
              transform: [{ translateY: floatAnim }],
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
