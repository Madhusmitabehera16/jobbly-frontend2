import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { JobMatchData } from "@/src/types/api";

export const useJobMatches = () => {
  return useQuery<JobMatchData>({
    queryKey: ["jobMatches"],
    queryFn: async () => {
      const response = await api.post("/ai/job-matching");
      return response.data.jobMatches as JobMatchData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
