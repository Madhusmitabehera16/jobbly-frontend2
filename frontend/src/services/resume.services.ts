import api from "@/src/lib/api";

export const uploadResume = async (
  file: File,
  companyName: string,
  roleTitle: string,
  jobDescription: string
) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("companyName", companyName);
  formData.append("roleTitle", roleTitle);
  formData.append("jobDescription", jobDescription);

  const response = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const parseResume = async (resumeId: string) => {
  const response = await api.post(
    `/resume/parse/${resumeId}`
  );

  return response.data;
};