import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface ReserveAppointmentInput {
  slot_window_id: string;
  client_id: string;
}

type UseReserveAppointmentOptions = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export const useReserveAppointment = (
  options?: UseReserveAppointmentOptions
) => {
  return useMutation({
    mutationFn: async (input: ReserveAppointmentInput) => {
      const res = await apiClient.api.tasks.appointments.reserve.$post({
        json: {
          slot_window_id: input.slot_window_id,
          client_id: input.client_id,
        },
      });

      if (!res.ok) {
        // Handle specific error cases with user-friendly messages
        if (res.status === 409) {
          // Conflict - client already has appointment
          throw new Error(
            "You already have an appointment booked for this time slot"
          );
        } else if (res.status === 404) {
          throw new Error("This time slot is no longer available");
        } else if (res.status === 400) {
          throw new Error(
            "Unable to book this appointment. Please try a different time slot"
          );
        } else if (res.status >= 500) {
          throw new Error(
            "Our system is having trouble right now. Please try again in a moment"
          );
        }

        // Generic error for other cases
        throw new Error("Something went wrong. Please try again");
      }

      return res.json();
    },

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onError: (error) => {
      options?.onError?.(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again"
      );
    },
  });
};
