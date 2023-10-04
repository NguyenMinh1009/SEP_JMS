import React from "react";
import TextFieldJobComment from "./common/TextFieldComment";
import { AnimatePresence } from "framer-motion";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";

interface IReplyCommentSection {
  replyCommentId: string;
  correlationJobType: CorrelationJobType;
  visibleType: VisibleType;
  expand?: boolean;
  parentUser?: any;
  parentContent?: string;
  getComments: () => void;
  setOpenReplySection: (Open: boolean) => void;
}

const ReplyCommentSection: React.FC<IReplyCommentSection> = ({
  replyCommentId,
  correlationJobType,
  visibleType,
  parentUser,
  expand,
  parentContent,
  getComments,
  setOpenReplySection
}) => {
  return (
    <>
      {expand && (
        <div className="mt-4 border-l-[1px] border-slate-500 pl-6">
          <p className="mb-4 w-fit cursor-pointer leading-5 hover:underline active:font-[500]">
            <span className="mr-2">Đang trả lời</span>
            <span className="font-semibold italic text-accent">{`@${parentUser?.fullname}`}</span>
          </p>
          <AnimatePresence>
            <TextFieldJobComment
              reply
              setOpenReplySection={setOpenReplySection}
              getComments={getComments}
              visibleType={visibleType}
              replyCommentId={replyCommentId}
              label="Thêm câu trả lời..."
            />
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default ReplyCommentSection;
