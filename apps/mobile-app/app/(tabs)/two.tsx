import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { ButtonComponent, ButtonSize } from "@/components/basic";
import { Color } from '@repo/config';
import { ArrowRightIcon, CheckIcon, HeartIcon, PlusIcon, ShoppingCartIcon, StarIcon } from "phosphor-react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      {/* Sample 1: Small button with both icons - Green theme */}
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

      {/* Sample 2: Medium button with both icons - Dark Green theme */}
      <ButtonComponent
        size={ButtonSize.Medium}
        leftIcon={PlusIcon}
        rightIcon={ArrowRightIcon}
      >
        Add Item
      </ButtonComponent>

      {/* Sample 3: Large button with both icons - Light Green theme */}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

