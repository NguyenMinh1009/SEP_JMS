import { FileResponse } from "./fileResponse";

export interface IComments {
  commentId: string;
  correlationJobId: string;
  correlationJobType: number;
  user: {
    userId: string;
    avatarUrl?: string;
    fullname: string;
    email: string;
  };
  hasReply: boolean;
  replyCommentId?: string;
  content: string;
  attachments: {
    files: FileResponse[];
    folder: string;
  };
  createdTime: number;
  replyComment?: any;
}
