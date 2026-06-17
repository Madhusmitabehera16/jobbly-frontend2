import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { SkillGapData } from "@/src/types/api";

export const useSkillGap = () => {
  return useQuery<SkillGapData>({
    queryKey: ["skillGap"],
    queryFn: async () => {
      const response = await api.post("/ai/skill-gap");
      return response.data.skillGap as SkillGapData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
