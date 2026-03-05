import { ButtonComponent, ButtonSize, TextComponent } from "@/components/basic";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Icons } from "@/config";
import { Color, Font, TextSize, TextVariant, textStyles } from "@repo/config";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type TextStyle as RNTextStyle,
} from "react-native";

// Text styles
const textLargeStyle = textStyles[TextVariant.Body][TextSize.Large];

export default function ReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      {/* Header with Title and Button */}
      <View style={styles.header}>
        <TextComponent
          variant={TextVariant.Title}
          size={TextSize.Large}
          color={Color.Black}
        >
          Reports
        </TextComponent>

        <ButtonComponent
          size={ButtonSize.Medium}
          buttonColor={Color.Black}
          textColor={Color.White}
          onPress={() => {
            // TODO: Implement request report functionality
            console.log("Request Report pressed");
          }}
        >
          + Request Report
        </ButtonComponent>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          variant="outline"
          size="md"
          style={{
            borderColor: Color.LightGrey,
            borderWidth: 1.5,
            borderRadius: 12,
            width: "100%",
            height: 56,
            backgroundColor: Color.White,
          }}
        >
          <InputField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
            placeholderTextColor={Color.Grey}
            style={{
              paddingLeft: 16,
              paddingRight: 48,
              paddingVertical: 12,
              fontFamily:
                textLargeStyle.fontFamily === Font.DMsans
                  ? "DMSans_400Regular"
                  : "Lato_400Regular",
              fontSize: textLargeStyle.fontSize,
              fontWeight: "400" as RNTextStyle["fontWeight"],
              textAlign: "left",
              color: Color.Black,
            }}
          />
          <InputSlot className="pr-4">
            <Icons.Search size={20} color={Color.Grey} weight="regular" />
          </InputSlot>
        </Input>
      </View>

      {/* Reports List */}
      <ScrollView style={styles.content}>
        {/* TODO: Add reports list here */}
        <View style={styles.emptyState}>
          <TextComponent
            variant={TextVariant.Body}
            size={TextSize.Medium}
            color={Color.Black}
            style={{ opacity: 0.5 }}
          >
            No reports available yet
          </TextComponent>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});
