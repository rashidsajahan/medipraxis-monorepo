import { Color, TextSize, TextVariant } from "@repo/config";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { setStringAsync } from "expo-clipboard";
import { CheckIcon, CopySimpleIcon, KeyIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import {
  ButtonComponent,
  ButtonSize,
  TextComponent,
} from "../../components/basic";
import { generateRecoveryKey, generateUserKeys } from "../../utils/userKeys";

export default function KeyRevealScreen() {
  const router = useRouter();
  const { phoneNumber, countryCode } = useLocalSearchParams<{
    phoneNumber: string;
    countryCode: string;
  }>();
  const [acknowledged, setAcknowledged] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("................");
  const [copied, setCopied] = useState(false);
  const [generatingKeys, setGeneratingKeys] = useState(false);

  const handleCopy = async () => {
    await setStringAsync(recoveryKey);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 2000);
  };

  useEffect(() => {
    void (async () => {
      const { raw } = await generateRecoveryKey();
      setRecoveryKey(raw);
    })();
  }, []);

  const handleContinue = async () => {
    setGeneratingKeys(true);
    // Yield to let the UI re-render the loading state before heavy work starts
    await new Promise((resolve) => setTimeout(resolve, 50));
    const userKeys = await generateUserKeys(recoveryKey);
    console.log("[DEV] user keys:", userKeys);
    setGeneratingKeys(false);
    router.replace({
      pathname: "/auth/login",
      params: { phoneNumber, countryCode },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={[Color.White, "#B6F6D2"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
        }}
      />

      <Modal transparent animationType="fade" visible statusBarTranslucent>
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View
            className="bg-white rounded-[20px] p-7 w-full"
            style={{
              maxWidth: 400,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Key icon — circular amber background */}
            <View
              className="self-center rounded-full w-16 h-16 justify-center items-center mb-4"
              style={{ backgroundColor: Color.LightCream }}
            >
              <KeyIcon size={30} color={Color.Warning} weight="duotone" />
            </View>

            <TextComponent
              variant={TextVariant.Title}
              size={TextSize.Large}
              className="text-center mb-3"
            >
              Your Encryption Key
            </TextComponent>

            {/* Warning message */}
            <View
              className="rounded-lg p-4 mb-5"
              style={{
                backgroundColor: Color.LightCream,
                borderWidth: 1,
                borderColor: Color.Warning,
              }}
            >
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Medium}
                color={Color.Grey}
                style={{ lineHeight: 22 }}
              >
                This key is generated once and never shown again. Store it
                offline in a safe place. Without it, your encrypted patient data
                cannot be recovered, not even by our support team.
              </TextComponent>
            </View>

            {/* Recovery key — 2 rows of [X][X][X][X] · [X][X][X][X] */}
            <View className="mb-5 gap-2">
              {[recoveryKey.slice(0, 8), recoveryKey.slice(8, 16)].map(
                (half: string, row: number) => (
                  <View key={row} className="flex-row items-center justify-center gap-2">
                    <View className="flex-row gap-1">
                      {half.slice(0, 4).split("").map((char: string, i: number) => (
                        <View
                          key={i}
                          className="bg-gray-100 border border-gray-300 rounded-md w-9 h-9 items-center justify-center"
                        >
                          <TextComponent
                            variant={TextVariant.Body}
                            size={TextSize.Small}
                            style={{ fontFamily: "monospace", fontWeight: "700" }}
                          >
                            {char}
                          </TextComponent>
                        </View>
                      ))}
                    </View>
                    <View className="w-4 h-px bg-gray-300" />
                    <View className="flex-row gap-1">
                      {half.slice(4, 8).split("").map((char: string, i: number) => (
                        <View
                          key={i}
                          className="bg-gray-100 border border-gray-300 rounded-md w-9 h-9 items-center justify-center"
                        >
                          <TextComponent
                            variant={TextVariant.Body}
                            size={TextSize.Small}
                            style={{ fontFamily: "monospace", fontWeight: "700" }}
                          >
                            {char}
                          </TextComponent>
                        </View>
                      ))}
                    </View>
                  </View>
                )
              )}
            </View>

            {/* Copy button */}
            <TouchableOpacity
              onPress={() => { void handleCopy(); }}
              className="flex-row items-center justify-center gap-1.5 mb-5"
              activeOpacity={0.7}
            >
              {copied ? (
                <CheckIcon size={16} color={Color.Green} />
              ) : (
                <CopySimpleIcon size={16} color={Color.Grey} />
              )}
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Small}
                color={copied ? Color.Green : Color.Grey}
              >
                {copied ? "Copied!" : "Copy key"}
              </TextComponent>
            </TouchableOpacity>

            {/* Acknowledge checkbox row */}
            <TouchableOpacity
              onPress={() => setAcknowledged((v) => !v)}
              className="flex-row items-center mb-5 gap-2.5"
              activeOpacity={0.7}
            >
              <View
                className="w-[22px] h-[22px] rounded-md border-2 justify-center items-center"
                style={{
                  borderColor: acknowledged ? Color.Green : Color.Grey,
                  backgroundColor: acknowledged ? Color.Green : "transparent",
                }}
              >
                {acknowledged && (
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Small}
                    color={Color.White}
                  >
                    ✓
                  </TextComponent>
                )}
              </View>
              <TextComponent
                variant={TextVariant.Body}
                size={TextSize.Small}
                color={Color.Grey}
                style={{ flex: 1 }}
              >
                I understand and have saved my key safely
              </TextComponent>
            </TouchableOpacity>

            <ButtonComponent
              onPress={() => { void handleContinue(); }}
              disabled={!acknowledged || generatingKeys}
              buttonColor={acknowledged && !generatingKeys ? Color.Green : Color.Grey}
              textColor={Color.White}
              size={ButtonSize.Large}
            >
              {generatingKeys ? (
                <ActivityIndicator size="small" color={Color.White} />
              ) : (
                <TextComponent
                  variant={TextVariant.Button}
                  size={TextSize.Medium}
                  color={Color.White}
                >
                  Continue to Login
                </TextComponent>
              )}
            </ButtonComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
}
