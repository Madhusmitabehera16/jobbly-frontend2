import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { Resume } from "@/src/types/api";

export const useResume = () => {
  return useQuery<Resume>({
    queryKey: ["resume"],
    queryFn: async () => {
      const response = await api.get("/resume/me");
      return response.data.resume as Resume;
    },
  });
};
