import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Color, Font, TextSize, TextVariant, textStyles } from '@repo/config';
import { EyeIcon, EyeSlashIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, TextStyle as RNTextStyle, StyleSheet, Text, View } from 'react-native';

// Props for the TextInput component
interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  borderColor?: Color;
  textColor?: Color;
  placeholderColor?: Color;
  labelColor?: Color;
  inputType?: 'text' | 'number' | 'decimal' | 'email' | 'phone' | 'password';
  showPasswordToggle?: boolean;
}

// Props for OTP Input Field
interface OTPInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  borderColor?: Color;
  textColor?: Color;
  labelColor?: Color;
  size?: number;
}

// Type for TextInputComponent with OTPField
interface TextInputComponentType extends React.FC<TextInputProps> {
  OTPField: React.FC<OTPInputFieldProps>;
}

// Map inputType to React Native keyboardType
const getKeyboardType = (type: string) => {
  switch (type) {
    case 'number':
      return 'number-pad';
    case 'decimal':
      return 'decimal-pad';
    case 'email':
      return 'email-address';
    case 'phone':
      return 'phone-pad';
    default:
      return 'default';
  }
};

// Text styles
const textLargeStyle = textStyles[TextVariant.Body][TextSize.Large];
const buttonLargeStyle = textStyles[TextVariant.Button][TextSize.Large];

// Default TextInput component
const TextInputBase: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Enter text',
  label,
  isDisabled = false,
  isInvalid = false,
  borderColor = Color.LightGrey,
  textColor = Color.Black,
  placeholderColor = Color.Grey,
  labelColor = Color.Black,
  inputType = 'text',
  showPasswordToggle = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const shouldShowToggle = showPasswordToggle || inputType === 'password';
  const isSecureEntry = shouldShowToggle && !isPasswordVisible;

  return (
    <View style={styles.inputWrapper}>
      {label && (
        <Text style={[styles.label, { 
          color: labelColor,
          fontFamily: textLargeStyle.fontFamily === Font.DMsans ? 'DMSans_400Regular' : 'Lato_400Regular',
          fontSize: textLargeStyle.fontSize,
          fontWeight: String(textLargeStyle.fontWeight) as RNTextStyle['fontWeight'],
        }]}>
          {label}
        </Text>
      )}
      <Input
        variant="outline"
        size="md"
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        style={{
          borderColor: borderColor,
          borderRadius: 8,
          width: '100%',
          height: 50,
        }}
      >
        <InputField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={isSecureEntry}
          style={{
            color: textColor,
            paddingHorizontal: 16,
            paddingVertical: 8,
            paddingRight: shouldShowToggle ? 48 : 16,
            fontFamily: textLargeStyle.fontFamily === Font.DMsans ? 'DMSans_400Regular' : 'Lato_400Regular',
            fontSize: textLargeStyle.fontSize,
            fontWeight: String(textLargeStyle.fontWeight) as RNTextStyle['fontWeight'],
            textAlign: 'left',
          }}
          keyboardType={getKeyboardType(inputType)}
        />
        {shouldShowToggle && (
          <InputSlot style={styles.iconSlot}>
            <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? (
                <EyeIcon size={20} color={Color.Grey} weight="regular" />
              ) : (
                <EyeSlashIcon size={20} color={Color.Grey} weight="regular" />
              )}
            </Pressable>
          </InputSlot>
        )}
      </Input>
    </View>
  );
};

// OTP Input Field component
const OTPField: React.FC<OTPInputFieldProps> = ({
  value,
  onChangeText,
  label,
  isDisabled = false,
  isInvalid = false,
  borderColor = Color.LightGrey,
  textColor = Color.Black,
  labelColor = Color.Black,
  size = 50,
}) => {
  return (
    <View style={styles.otpWrapper}>
      {label && (
        <Text style={[styles.label, { 
          color: labelColor,
          fontFamily: textLargeStyle.fontFamily === Font.DMsans ? 'DMSans_400Regular' : 'Lato_400Regular',
          fontSize: textLargeStyle.fontSize,
          fontWeight: String(textLargeStyle.fontWeight) as RNTextStyle['fontWeight'],
        }]}>
          {label}
        </Text>
      )}
      <Input
        variant="outline"
        size="md"
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        style={{
          borderColor: borderColor,
          borderRadius: 8,
          width: size,
          height: size,
        }}
      >
        <InputField
          value={value}
          onChangeText={onChangeText}
          maxLength={1}
          style={{
            color: textColor,
            fontFamily: buttonLargeStyle.fontFamily === Font.DMsans ? 'DMSans_500Regular' : 'Lato_500Regular',
            fontSize: buttonLargeStyle.fontSize,
            fontWeight: String(buttonLargeStyle.fontWeight) as RNTextStyle['fontWeight'],
            textAlign: 'center',
          }}
          keyboardType="number-pad"
        />
      </Input>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
  },
  otpWrapper: {
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
  },
  iconSlot: {
    paddingRight: 16,
  },
});

// Combine the components
export const TextInputComponent = Object.assign(TextInputBase, {
  OTPField: OTPField,
}) as TextInputComponentType;

