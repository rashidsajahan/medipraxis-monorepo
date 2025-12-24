import React, { useState } from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import TextComponent, { ButtonComponent, ButtonSize, TextInputComponent } from "@/components/basic";
import { Color, TextSize, TextVariant } from '@repo/config';
import { ArrowRightIcon, CheckIcon, HeartIcon, PlusIcon, ShoppingCartIcon, StarIcon } from "phosphor-react-native";

export default function TabTwoScreen() {
  const [textInput, setTextInput] = useState("");
  const [otp, setOtp] = useState("");

  return (
      <View style={styles.container}>
        <View>
          <TextComponent variant={TextVariant.Title} size={TextSize.ExtraLarge}>
            Title-extralarge
          </TextComponent>
          <TextComponent variant={TextVariant.Title} size={TextSize.Large}>
            Title-large
          </TextComponent>
          <TextComponent variant={TextVariant.Title} size={TextSize.Medium}>
            Title-medium
          </TextComponent>
          <TextComponent variant={TextVariant.Title} size={TextSize.Small}>
            Title-small
          </TextComponent>
          <TextComponent variant={TextVariant.Button} size={TextSize.Large}>
            Button-large
          </TextComponent>
          <TextComponent variant={TextVariant.Button} size={TextSize.Medium}>
            Button-medium
          </TextComponent>
          <TextComponent variant={TextVariant.Button} size={TextSize.Small}>
            Button-small
          </TextComponent>
          <TextComponent variant={TextVariant.Body} size={TextSize.Large}>
            Body-large
          </TextComponent>
          <TextComponent variant={TextVariant.Body} size={TextSize.Medium}>
            Body-medium
          </TextComponent>
          <TextComponent variant={TextVariant.Body} size={TextSize.Small}>
            Body-small
          </TextComponent>
        </View>

        <View style={styles.separator} />
        <View>
          <TextInputComponent
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Enter your name"
            label="Text Input"
          />
        </View>
        <View style={styles.separator} />
        <View>
          <TextInputComponent.OTPField
            value={otp}
            onChangeText={setOtp}
            label="OTP Input"
          />
        </View>

      <View style={styles.buttonContainer}>
        {/* Small button */}
        <View style={styles.centeredButton}>
          <ButtonComponent
            size={ButtonSize.Small}
            leftIcon={HeartIcon}
            rightIcon={StarIcon}
            buttonColor={Color.Green}
            textColor={Color.White}
            iconColor={Color.LightCream}
          >
            Favorite
          </ButtonComponent>
        </View>

        {/* Medium button */}
        <View style={styles.centeredButton}>
          <ButtonComponent
            size={ButtonSize.Medium}
            leftIcon={PlusIcon}
            rightIcon={ArrowRightIcon}
          >
            Add Item
          </ButtonComponent>
        </View>

        {/* Large button */}
        <ButtonComponent
          size={ButtonSize.Large}
          leftIcon={CheckIcon}
          rightIcon={ShoppingCartIcon}
          buttonColor={Color.LightGreen}
          textColor={Color.DarkGreen}
          iconColor={Color.Green}
        >
          Complete Purchase
        </ButtonComponent>
      </View>
      
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 16,
  },
  centeredButton: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  }
});

