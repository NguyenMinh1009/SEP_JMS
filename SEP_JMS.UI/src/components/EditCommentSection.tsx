import React from "react";
import TextFieldJobComment from "./common/TextFieldComment";
import { AnimatePresence } from "framer-motion";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import TextFieldCommentEdit from "./common/TextFieldCommentEdit";

interface IReplyCommentSection {
  commentId: string;
  correlationJobType: CorrelationJobType;
  visibleType: VisibleType;
  expand?: boolean;
  parentUser?: any;
  parentContent: string;
  remoteFiles?: {
    name: string;
    type?: string;
    originalName?: string;
  }[];
  getComments: () => void;
  refreshComment: (value: string, attachments: any) => void;
  setOpenReplySection: (Open: boolean) => void;
}

const EditCommentSection: React.FC<IReplyCommentSection> = ({
  commentId,
  correlationJobType,
  visibleType,
  parentUser,
  expand,
  parentContent,
  remoteFiles,
  getComments,
  refreshComment,
  setOpenReplySection
}) => {
  return (
    <>
      {expand && (
        <div className="mt-4 border-l-[1px] border-slate-500 pl-6">
          <p className="mb-4 w-fit cursor-pointer leading-5 hover:underline active:font-[500]">
            <span className="mr-2">Đang chỉnh sửa</span>
            <span className="font-semibold italic text-accent">{`@${parentUser?.fullname}`}</span>
          </p>
          <AnimatePresence>
            <TextFieldCommentEdit
              reply
              setOpenReplySection={setOpenReplySection}
              getComments={getComments}
              refreshComment={refreshComment}
              visibleType={visibleType}
              commentId={commentId}
              oldContent={parentContent}
              label="Chỉnh sửa bình luận"
              oldRemoteFiles={remoteFiles}
            />
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default EditCommentSection;
