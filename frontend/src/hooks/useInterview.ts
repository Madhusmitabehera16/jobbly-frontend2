import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { InterviewData } from "@/src/types/api";

export const useInterview = () => {
  return useQuery<InterviewData>({
    queryKey: ["interview"],
    queryFn: async () => {
      const response = await api.post("/ai/interview");
      return response.data.interview as InterviewData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
