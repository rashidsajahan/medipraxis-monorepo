import { API_BASE_URL } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export const useDoctorPublicKey = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["doctor-public-key", userId],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/user-keys/${userId}/public-key`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch doctor encryption key");
      }
      const data = (await res.json()) as { public_key: string };
      return data.public_key;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};
