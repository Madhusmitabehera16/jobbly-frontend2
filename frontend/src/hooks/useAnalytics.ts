import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { AnalyticsData } from "@/src/types/api";

export const useAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await api.post("/ai/analytics");
      return response.data.analytics as AnalyticsData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
