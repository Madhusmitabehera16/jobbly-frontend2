import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { ImprovementsData } from "@/src/types/api";

export const useImprovements = () => {
  return useQuery<ImprovementsData>({
    queryKey: ["improvements"],
    queryFn: async () => {
      const response = await api.post("/ai/improvements");
      return response.data.improvements as ImprovementsData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
