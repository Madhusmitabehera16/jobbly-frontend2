import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { RoadmapData } from "@/src/types/api";

export const useRoadmap = () => {
  return useQuery<RoadmapData>({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const response = await api.post("/ai/roadmap");
      return response.data.roadmap as RoadmapData;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};
