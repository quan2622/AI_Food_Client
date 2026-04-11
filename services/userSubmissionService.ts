import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import { ICreateSubmissionRequest, IUserSubmission } from "@/types/user-submission.type";

export const userSubmissionService = {
  createSubmission: async (data: ICreateSubmissionRequest): Promise<ApiResponse<IUserSubmission>> => {
    const res = await privateAxios.post<ApiResponse<IUserSubmission>>("/user-submissions", data);
    return res as unknown as ApiResponse<IUserSubmission>;
  },

  getMySubmissions: async (): Promise<ApiResponse<IUserSubmission[]>> => {
    const res = await privateAxios.get<ApiResponse<IUserSubmission[]>>("/user-submissions/my-submissions");
    return res as unknown as ApiResponse<IUserSubmission[]>;
  },

  deleteSubmission: async (id: number): Promise<ApiResponse<any>> => {
    const res = await privateAxios.delete<ApiResponse<any>>(`/user-submissions/my-submissions/${id}`);
    return res as unknown as ApiResponse<any>;
  },

  voteSubmission: async (id: number, voteType: "upvote" | "downvote"): Promise<ApiResponse<any>> => {
    const res = await privateAxios.post<ApiResponse<any>>(`/user-submissions/${id}/vote`, { voteType });
    return res as unknown as ApiResponse<any>;
  },
};
