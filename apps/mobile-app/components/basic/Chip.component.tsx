import { Icons } from "@/config";
import { Color, TextSize, TextVariant, textStyles } from "@repo/config";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type IconComponent = typeof Icons[keyof typeof Icons];

export enum IconSize {
  Small = 12,
  Medium = 14,
}

export interface ChipComponentProps {
  text: string;
  backgroundColor?: Color;
  textColor?: Color;
  textSize?: Exclude<TextSize, TextSize.ExtraLarge>;
  iconName?: IconComponent;
  iconSize?: IconSize;
  iconColor?: Color;
  iconPosition?: "left" | "right";
}

export const ChipComponent: React.FC<ChipComponentProps> = ({
  text,
  backgroundColor = Color.Green,
  textColor = Color.White,
  textSize = TextSize.Medium,
  iconName,
  iconSize = IconSize.Medium,
  iconColor,
  iconPosition = "left",
}) => {
  // Get text style from the design system
  const textStyle = textStyles[TextVariant.Body][textSize];
  
  // Use textColor as default iconColor if not specified
  const finalIconColor = iconColor || textColor;
  
  // Icon component is now directly passed
  const IconComponent = iconName;

  //Add bold weight for medium size icon
  const finalIconWeight = (iconSize === IconSize.Medium ? "bold" : "regular");
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      {/* Render icon on the left if specified */}
      {IconComponent && iconPosition === "left" && (
        <View style={styles.iconContainer}>
          <IconComponent
            size={iconSize}
            color={finalIconColor}
            weight={finalIconWeight}
          />
        </View>
      )}
      
      <Text
        style={{
          color: textColor,
          fontFamily: textStyle.fontFamily,
          fontSize: textStyle.fontSize,
          fontWeight: String(textStyle.fontWeight) as any,
          fontStyle: textStyle.fontStyle,
        }}
      >
        {text}
      </Text>
      
      {/* Render icon on the right if specified */}
      {IconComponent && iconPosition === "right" && (
        <View style={styles.iconContainer}>
          <IconComponent
            size={iconSize}
            color={finalIconColor}
            weight={finalIconWeight}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  iconContainer: {
    marginHorizontal: 4,
  },
});
