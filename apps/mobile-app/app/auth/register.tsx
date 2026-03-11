import { Icons } from "@/config";
import { Color, TextSize, TextVariant } from "@repo/config";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+94");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [agreed, setAgreed] = useState(false);

  const { signUp, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }
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
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "Please agree to the terms and policy");
      return;
    }
    try {
      await signUp(phoneNumber, countryCode, password, username);
    } catch (e: any) {
      console.error("Register Error:", e);
      Alert.alert(
        "Registration Failed",
        typeof e.message === "string" ? e.message : JSON.stringify(e)
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: Color.White }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-1"
          style={{
            padding: 20,
            justifyContent: "flex-end",
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

          {/* Storyset Illustration */}
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth/privacy-policy-rafiki.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
              alt="Registration Illustration"
            />
          </View>

          {/* Floating Card Container */}
          <View
            className="bg-white rounded-[24px] p-6 shadow-md mb-6 mt-4"
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
              className="mb-4"
            >
              Enter your details to create an account
            </TextComponent>

            <View className="mb-4">
              <TextInputComponent
                inputField={{
                  placeholder: "Username",
                  value: username,
                  onChangeText: setUsername,
                }}
              />
            </View>

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

            <View className="mb-4">
              <TextInputComponent
                inputType={TextInputType.Password}
                inputField={{
                  placeholder: "Confirm Password",
                  value: confirmPassword,
                  onChangeText: setConfirmPassword,
                }}
              />
            </View>

            <View className="flex-row items-start mb-6 pr-6">
              <Checkbox
                size="md"
                value="agree"
                isChecked={agreed}
                onChange={(isChecked: boolean) => setAgreed(isChecked)}
                aria-label="I agree"
                className="flex-1"
              >
                <CheckboxIndicator className="mr-2 mt-1">
                  <CheckboxIcon as={Icons.Check} />
                </CheckboxIndicator>
                <CheckboxLabel className="flex-1">
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Grey}
                  >
                    I agree with MediPraxis Public Agreement, Terms & Policy
                  </TextComponent>
                </CheckboxLabel>
              </Checkbox>
            </View>

            <View className="mb-4">
              <ButtonComponent
                onPress={handleRegister}
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
                  {isLoading ? "Wait..." : "Register"}
                </TextComponent>
              </ButtonComponent>
            </View>

            <View className="flex-row justify-start items-center">
              <TextComponent variant={TextVariant.Body} size={TextSize.Small}>
                Already have an account?{" "}
              </TextComponent>
              <Link href={"/auth/login" as any} asChild>
                <TouchableOpacity>
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.Green}
                  >
                    LOGIN
                  </TextComponent>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
