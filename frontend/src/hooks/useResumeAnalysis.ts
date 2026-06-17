import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { ResumeAnalysisData } from "@/src/types/api";

export const useResumeAnalysis = () => {
  return useQuery<ResumeAnalysisData>({
    queryKey: ["resumeAnalysis"],
    queryFn: async () => {
      const response = await api.post("/ai/resume-analysis");
      return response.data.analysis as ResumeAnalysisData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
