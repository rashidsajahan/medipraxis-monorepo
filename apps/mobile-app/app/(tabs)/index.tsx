import { View } from "@/components/Themed";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import { FormSetupCenter } from "@/components/advanced/formSetupCenter";
import TaskForm from "@/components/advanced/taskPanel/TaskForm";
import { Text } from "@/components/Themed";
import { Icons } from "@/config";
import { Color, TextSize, textStyles, TextVariant } from "@repo/config";
import HomeCard from "./HomeCard.component";

export default function TabOneScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showFormSetup, setShowFormSetup] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
        {/* Home Card */}
        <HomeCard />

        {/* Upcoming Events Header */}
        <View className="flex-row justify-between items-center px-4 pt-6 pb-2">
          <Text
            style={{
              ...textStyles[TextVariant.Title][TextSize.Small],
              color: Color.Black,
            }}
          >
            Upcoming events
          </Text>

          <View
            className="flex-row gap-3"
            style={{ flexDirection: "row", gap: 12 }}
          >
            {/* + icon — Open Appointment Form */}
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Color.LightGrey,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.Plus size={20} color={Color.DarkGreen} />
            </TouchableOpacity>

            {/* File icon — Form Setup Center */}
            <TouchableOpacity
              onPress={() => setShowFormSetup(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Color.LightGrey,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.FileText size={20} color={Color.DarkGreen} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Appointment modal only shows when state is true */}
      <TaskForm visible={showForm} onClose={() => setShowForm(false)} />

      {/* Form Setup Center modal */}
      <FormSetupCenter
        visible={showFormSetup}
        onClose={() => setShowFormSetup(false)}
      />
    </View>
  );
}
