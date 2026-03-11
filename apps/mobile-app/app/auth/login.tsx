import { Icons } from "@/config";
import { Color, TextSize, TextVariant } from "@repo/config";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import {
  ButtonComponent,
  ButtonSize,
  TextComponent,
  TextInputComponent,
  TextInputType,
} from "../../components/basic";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../../components/ui/checkbox";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+94");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required");
      return;
    }
    if (!countryCode.trim()) {
      Alert.alert("Error", "Country code is required");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password is required");
      return;
    }
    try {
      await signIn(phoneNumber, countryCode, password);
    } catch (e: any) {
      console.error("Login Error:", e);
      Alert.alert(
        "Login Failed",
        typeof e.message === "string" ? e.message : JSON.stringify(e)
      );
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: Color.White }}>
      <View
        className="flex-1"
        style={{
          padding: 20,
          justifyContent: "flex-end", // Align container content to the bottom
          position: "relative",
        }}
      >
        <LinearGradient
          colors={[Color.White, "#B6F6D2"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%", // Only cover bottom half
          }}
        />

        <View className="mb-4">
          <View className="items-center">
            {/* USER: Replace 'icon.png' below with 'privacy-policy.png' after you download it from Storyset! */}
            <Image
              source={require("../../assets/images/auth/privacy-policy-rafiki.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
              alt="Privacy Policy Illustration"
            />
          </View>

          {/* Floating Card Container */}
          <View
            className="bg-white rounded-[24px] p-6 shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            {/* Logo */}
            <View className="items-center">
              <Image
                source={require("../../assets/images/brand-logo-with-name.png")}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
                alt="MediPraxis Logo"
              />
            </View>

            <TextComponent
              variant={TextVariant.Title}
              size={TextSize.Large}
              className="mb-1"
            >
              Welcome
            </TextComponent>
            <TextComponent
              variant={TextVariant.Body}
              size={TextSize.Medium}
              color={Color.Grey}
              className="mb-6"
            >
              Enter your details to log in
            </TextComponent>

            <View className="flex-row items-center mb-4 gap-2">
              <View style={{ flex: 0.3 }}>
                <TextInputComponent
                  inputField={{
                    placeholder: "Code",
                    value: countryCode,
                    onChangeText: setCountryCode,
                  }}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <TextInputComponent
                  inputType={TextInputType.Phone}
                  inputField={{
                    placeholder: "Mobile Number",
                    value: phoneNumber,
                    onChangeText: setPhoneNumber,
                  }}
                />
              </View>
            </View>

            <View className="mb-4">
              <TextInputComponent
                inputType={TextInputType.Password}
                inputField={{
                  placeholder: "Password",
                  value: password,
                  onChangeText: setPassword,
                }}
              />
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <Checkbox
                size="md"
                value="remember"
                isChecked={rememberMe}
                onChange={(isChecked: boolean) => setRememberMe(isChecked)}
                aria-label="Remember Me"
              >
                <CheckboxIndicator className="mr-2">
                  <CheckboxIcon as={Icons.Check} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                  >
                    Remember Me
                  </TextComponent>
                </CheckboxLabel>
              </Checkbox>

              <TouchableOpacity>
                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Green}
                >
                  Forgot Password?
                </TextComponent>
              </TouchableOpacity>
            </View>

            <ButtonComponent
              onPress={handleLogin}
              disabled={isLoading}
              buttonColor={Color.Black}
              textColor={Color.White}
              size={ButtonSize.Large}
            >
              <TextComponent
                variant={TextVariant.Button}
                size={TextSize.Medium}
                color={Color.White}
              >
                {isLoading ? "Logging in..." : "Login"}
              </TextComponent>
            </ButtonComponent>

            <View className="flex-row justify-center mt-6">
              <TextComponent variant={TextVariant.Body} size={TextSize.Small}>
                Don't have an account?{" "}
              </TextComponent>
              <Link href={"/auth/register" as any} asChild>
                <TouchableOpacity>
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Green}
                  >
                    REGISTER
                  </TextComponent>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
