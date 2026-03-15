import { Color } from "@repo/config";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type CheckboxComponentProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: React.ReactNode;
  color?: Color;
};

export function CheckboxComponent({
  checked,
  onChange,
  label,
  color = Color.Black,
}: CheckboxComponentProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      className="flex-row items-start gap-2.5"
      activeOpacity={0.7}
    >
      <View
        className="w-[22px] h-[22px] rounded-md border-2 justify-center items-center mt-0.5"
        style={{
          borderColor: checked ? color : Color.Grey,
          backgroundColor: checked ? color : "transparent",
        }}
      >
        {checked && (
          <View
            style={{
              width: 12,
              height: 6,
              borderLeftWidth: 2,
              borderBottomWidth: 2,
              borderColor: Color.White,
              transform: [{ rotate: "-45deg" }, { translateY: -1 }],
            }}
          />
        )}
      </View>
      {label !== undefined && (
        <View style={{ flex: 1 }}>{label}</View>
      )}
    </TouchableOpacity>
  );
}
