import {
  ButtonComponent,
  ButtonSize,
  DropdownComponent,
  TextComponent,
  TextInputComponent,
  TextInputType,
} from "@/components/basic";
import { Icons } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color, TextSize, TextVariant } from "@repo/config";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { z } from "zod";

// Validation schemas
const nameSchema = z
  .string()
  .min(1, "Required")
  .max(30, "Maximum 30 characters");

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
  .min(10, "Phone number too short")
  .max(20, "Phone number too long")
  .refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "Phone must have 10-15 digits");

const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return /^\+?[\d\s-()]+$/.test(val);
    },
    { message: "Invalid phone number" }
  )
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    },
    { message: "Phone must have 10-15 digits" }
  );

const dateSchema = z
  .string()
  .min(1, "Required")
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use DD/MM/YYYY")
  .refine((val) => {
    const parts = val.split("/").map(Number);
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    if (!day || !month || !year) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear) daysInMonth[1] = 29;

    const maxDays = daysInMonth[month - 1];
    if (!maxDays || day > maxDays) return false;

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) return false;

    return true;
  }, "Invalid date");

// Form schema
const clientFormSchema = z.object({
  title: nameSchema,
  firstName: nameSchema,
  lastName: z.string().max(30, "Maximum 30 characters").optional(),
  gender: nameSchema,
  dateOfBirth: dateSchema,
  contactNumber: phoneSchema,
  emergencyContactName: z.string().max(30, "Maximum 30 characters").optional(),
  emergencyContactNumber: optionalPhoneSchema,
  emergencyContactRelationship: z
    .string()
    .max(30, "Maximum 30 characters")
    .optional(),
  note: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

const titleOptions = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
  { label: "Ms", value: "Ms" },
  { label: "Dr", value: "Dr" },
  { label: "Prof", value: "Prof" },
  { label: "Rev", value: "Rev" },
];

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

interface AddClientProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (clientData: any) => void;
}

export const AddClient: React.FC<AddClientProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState("");

  const MAX_CONDITIONS = 5;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      contactNumber: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelationship: "",
      note: "",
    },
  });

  const resetForm = () => {
    reset();
    setConditions([]);
    setConditionInput("");
  };

  const handleAddCondition = () => {
    if (
      conditionInput.trim() &&
      conditions.length < MAX_CONDITIONS &&
      !conditions.includes(conditionInput.trim())
    ) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput("");
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setConditions(conditions.filter((c) => c !== condition));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (data: ClientFormData) => {
    const clientData = {
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName?.trim() || null,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      contactNumber: data.contactNumber,
      emergencyContactName: data.emergencyContactName?.trim() || null,
      emergencyContactNumber: data.emergencyContactNumber?.trim() || null,
      emergencyContactRelationship:
        data.emergencyContactRelationship?.trim() || null,
      conditions: conditions.length > 0 ? conditions : null,
      note: data.note?.trim() || null,
    };

    onSave?.(clientData);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.White }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-1" style={{ backgroundColor: Color.White }}>
            <View
              className="px-5 pt-3 pb-4"
              style={{ backgroundColor: Color.White }}
            >
              <View className="mb-4" style={{ alignSelf: "flex-start" }}>
                <ButtonComponent.BackButton
                  size={ButtonSize.Small}
                  onPress={handleClose}
                />
              </View>
              <TextComponent variant={TextVariant.Title} size={TextSize.Large}>
                Add Client Details
              </TextComponent>
            </View>

            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <View className="mb-3">
                <TextComponent
                  variant={TextVariant.Title}
                  size={TextSize.Small}
                >
                  Basic Information
                </TextComponent>
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                      <DropdownComponent
                        label="Title *"
                        value={value}
                        onValueChange={onChange}
                        options={titleOptions}
                        placeholder="Mr"
                        validationSchema={nameSchema}
                        validateOnChange={isSubmitted}
                      />
                    )}
                  />
                </View>
                <View className="flex-[2]">
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                      <TextInputComponent
                        label="First Name *"
                        inputField={{
                          value,
                          onChangeText: onChange,
                          placeholder: "John",
                        }}
                        validationSchema={nameSchema}
                        validateOnChange={isSubmitted}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Last Name"
                      inputField={{
                        value: value || "",
                        onChangeText: onChange,
                        placeholder: "Siriwardane",
                      }}
                    />
                  )}
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                      <DropdownComponent
                        label="Gender *"
                        value={value}
                        onValueChange={onChange}
                        options={genderOptions}
                        placeholder="Male"
                        validationSchema={nameSchema}
                        validateOnChange={isSubmitted}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { onChange, value } }) => (
                      <TextInputComponent
                        label="Date of birth *"
                        inputField={{
                          value,
                          onChangeText: onChange,
                          placeholder: "29/12/1998",
                        }}
                        validationSchema={dateSchema}
                        validateOnChange={isSubmitted}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="mb-6">
                <Controller
                  control={control}
                  name="contactNumber"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Contact Number *"
                      inputType={TextInputType.Phone}
                      inputField={{
                        value,
                        onChangeText: onChange,
                        placeholder: "+94 70 123 4567",
                      }}
                      validationSchema={phoneSchema}
                      validateOnChange={isSubmitted}
                    />
                  )}
                />
              </View>

              <View className="mb-3">
                <TextComponent
                  variant={TextVariant.Title}
                  size={TextSize.Small}
                >
                  Additional Information
                </TextComponent>
              </View>

              <View className="mb-4">
                <Controller
                  control={control}
                  name="emergencyContactName"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Emergency Contact Name"
                      inputField={{
                        value: value || "",
                        onChangeText: onChange,
                        placeholder: "Elena Siriwardane",
                      }}
                    />
                  )}
                />
              </View>

              <View className="mb-4">
                <Controller
                  control={control}
                  name="emergencyContactNumber"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Emergency Contact Number"
                      inputType={TextInputType.Phone}
                      inputField={{
                        value: value || "",
                        onChangeText: onChange,
                        placeholder: "+94 70 123 4567",
                      }}
                    />
                  )}
                />
              </View>

              <View className="mb-4">
                <Controller
                  control={control}
                  name="emergencyContactRelationship"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Emergency Contact Relationship"
                      inputField={{
                        value: value || "",
                        onChangeText: onChange,
                        placeholder: "Wife",
                      }}
                    />
                  )}
                />
              </View>

              <View className="mb-4">
                <View className="mb-2">
                  <TextComponent
                    variant={TextVariant.Body}
                    size={TextSize.Medium}
                  >
                    Known Conditions
                  </TextComponent>
                </View>
                <View className="flex-row gap-2 mb-3">
                  <View className="flex-1">
                    <TextInputComponent
                      inputField={{
                        value: conditionInput,
                        onChangeText: setConditionInput,
                        placeholder: "Condition Name",
                      }}
                    />
                  </View>
                  <ButtonComponent
                    size={ButtonSize.Small}
                    leftIcon={Icons.Plus}
                    buttonColor={Color.Black}
                    textColor={Color.White}
                    iconColor={Color.White}
                    onPress={handleAddCondition}
                    disabled={
                      !conditionInput.trim() ||
                      conditions.length >= MAX_CONDITIONS
                    }
                  >
                    Add
                  </ButtonComponent>
                </View>

                {conditions.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mb-2">
                    {conditions.map((condition) => (
                      <Pressable
                        key={condition}
                        onPress={() => handleRemoveCondition(condition)}
                        className="flex-row items-center rounded-full px-3 py-1.5"
                        style={{ backgroundColor: Color.Danger }}
                      >
                        <TextComponent
                          variant={TextVariant.Body}
                          size={TextSize.Small}
                          color={Color.White}
                          style={{ marginRight: 6 }}
                        >
                          ×
                        </TextComponent>
                        <TextComponent
                          variant={TextVariant.Body}
                          size={TextSize.Small}
                          color={Color.White}
                        >
                          {condition}
                        </TextComponent>
                      </Pressable>
                    ))}
                  </View>
                )}

                <TextComponent
                  variant={TextVariant.Body}
                  size={TextSize.Small}
                  color={Color.Grey}
                >
                  {MAX_CONDITIONS - conditions.length}/{MAX_CONDITIONS}{" "}
                  Remaining
                </TextComponent>
              </View>

              <View className="mb-6">
                <Controller
                  control={control}
                  name="note"
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      label="Note"
                      inputField={{
                        value: value || "",
                        onChangeText: onChange,
                        placeholder: "Type additional notes here",
                        multiline: true,
                        numberOfLines: 8,
                        textAlignVertical: "top",
                      }}
                    />
                  )}
                />
              </View>
            </ScrollView>

            <View
              className="px-5 pb-8 pt-4"
              style={{
                backgroundColor: Color.White,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ButtonComponent
                size={ButtonSize.Large}
                buttonColor={Color.Black}
                textColor={Color.White}
                onPress={handleSubmit(onSubmit)}
              >
                Save
              </ButtonComponent>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
