import {
  DMSans_400Regular,
  DMSans_500Medium,
} from "@expo-google-fonts/dm-sans";
import { Color } from "@repo/config";
import { useFonts } from "expo-font";
import { DotsSixVerticalIcon } from "phosphor-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { FieldItemProps } from "./formConfig.types";

export function FieldItem({
  field,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDragging = false,
}: FieldItemProps) {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const dragStartY = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Animation values
  const scaleXAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(0)).current;

  // Animate when dragging state changes
  useEffect(() => {
    if (isDragging) {
      Animated.parallel([
        Animated.spring(scaleXAnim, {
          toValue: 0.98,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(elevationAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleXAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(elevationAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isDragging, scaleXAnim, elevationAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => isDraggingRef.current,
      onPanResponderGrant: (evt) => {
        isDraggingRef.current = true;
        dragStartY.current = evt.nativeEvent.pageY;
        onDragStart?.();
      },
      onPanResponderMove: (evt) => {
        if (isDraggingRef.current) {
          onDragMove?.(evt.nativeEvent.pageY);
        }
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false;
        dragStartY.current = 0;
        onDragEnd?.();
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        dragStartY.current = 0;
        onDragEnd?.();
      },
    })
  ).current;

  if (!fontsLoaded) {
    return null;
  }

  const FieldIcon = field.icon;

  // Interpolate elevation
  const elevationValue = elevationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const shadowOpacity = elevationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  // Web-compatible drag handlers
  const handleMouseDown = (e: any) => {
    if (Platform.OS === "web") {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragStartY.current = e.clientY || e.pageY;
      onDragStart?.();

      const handleMouseMove = (e: MouseEvent) => {
        if (isDraggingRef.current) {
          e.preventDefault();
          onDragMove?.(e.clientY || e.pageY);
        }
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        dragStartY.current = 0;
        onDragEnd?.();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  return (
    <Animated.View
      className="flex-row items-stretch rounded-lg border border-gray-300 mb-3 overflow-hidden bg-white shadow-sm"
      style={{
        transform: [{ scaleX: scaleXAnim }],
        elevation: elevationValue,
        shadowOpacity: shadowOpacity,
        shadowColor: Color.Black,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      {/* Field Icon Section */}
      <TouchableOpacity
        className="w-14 py-4 px-3 bg-green-600 justify-center items-center border-r border-gray-300"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <FieldIcon size={20} color={Color.White} weight="regular" />
      </TouchableOpacity>

      {/* Field Name Section */}
      <TouchableOpacity
        className="flex-1 py-4 px-4 justify-center border-r border-gray-300"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <Text className="text-base font-medium text-black">
            {field.fieldName}
          </Text>
          {field.isRequired && (
            <Text className="text-base font-medium text-red-600 ml-0.5">*</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Drag Handle Section */}
      <View
        className={`w-12 py-4 px-3 justify-center items-center ${isDragging ? "bg-gray-600 opacity-80" : "bg-[#FFF8F0]"}`}
        style={
          Platform.OS === "web"
            ? ({ cursor: isDragging ? "grabbing" : "grab" } as any)
            : undefined
        }
        {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
        // @ts-ignore - web-specific event
        onMouseDown={Platform.OS === "web" ? handleMouseDown : undefined}
      >
        <DotsSixVerticalIcon size={20} color={Color.Grey} weight="bold" />
      </View>
    </Animated.View>
  );
}
