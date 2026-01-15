import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DaySelector } from "./DaySelector";
import { SlotWindow } from "./SlotWindow";

export const Route = createFileRoute("/schedules/$id")({
  component: ScheduleDetail,
});

type TimeSlot = {
  id: number;
  time: string;
  clinic: string;
  address: string;
  slots: number;
  available: boolean;
};

function ScheduleDetail() {
  const { id } = Route.useParams();
  const [selectedDay, setSelectedDay] = useState(0); // Start with today (index 0)

  const timeSlots: TimeSlot[] = [
    {
      id: 1,
      time: "6AM-9AM",
      clinic: "Heart Health Clinic",
      address: "123 Medical Plaza, Suite 200, New York, NY 10001",
      slots: 9,
      available: true,
    },
    {
      id: 2,
      time: "5PM-10PM",
      clinic: "Newmedi Clinic",
      address: "123 Medical Plaza, Suite 200, New York, NY 10001",
      slots: 0,
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-mp-white px-6 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-mp-dark-green mb-4 font-lato">
          Appointment
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-lg text-mp-dark-green font-dm-sans">
            to consult
          </span>
          <button className="bg-mp-green px-6 py-2 rounded-md hover:bg-mp-green/90 transition-colors">
            <span className="text-lg font-semibold text-mp-dark-green font-lato">
              Dr. Sarah Gracia
            </span>
          </button>
        </div>
      </div>

      {/* Day Selector - Single Row */}
      <DaySelector
        numberOfDays={7}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
      />

      {/* Time Slots */}
      <div className="space-y-8">
        {timeSlots.map((slot) => (
          <SlotWindow
            key={slot.id}
            id={slot.id}
            time={slot.time}
            clinic={slot.clinic}
            address={slot.address}
            slots={slot.slots}
            available={slot.available}
            onReserve={(id) => {
              console.log(`Reserving slot ${id}`);
              // Add your reservation logic here
            }}
          />
        ))}
      </div>
    </div>
  );
}
