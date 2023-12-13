import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import { IComments } from "../interface/comment";
import Comment from "./common/Comment";
import ReplyComment from "./common/ReplyComment";
import TextFieldJobComment from "./common/TextFieldComment";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { Role } from "../enums/role";
import { CommentString } from "../enums/commentEnum";

interface ICommentsProps {
  comments?: IComments[];
  setComments: React.Dispatch<
    React.SetStateAction<{
      items: IComments[];
      count: number;
    }>
  >;
  getComments: () => void;
  correlationJobType: CorrelationJobType;
  visibleType: VisibleType;
  handleHideComment?: (id: string) => void;
  finishedOnly?: boolean;
}

const CommentSection = ({
  comments,
  setComments,
  correlationJobType,
  getComments,
  visibleType,
  handleHideComment,
  finishedOnly
}: ICommentsProps) => {
  const currentPerson = useCurrentPerson();

  const renderAddComment = () => {
    let flagHidden;
    finishedOnly ? (flagHidden = true) : (flagHidden = false);
    // if (
    //   correlationJobType === CorrelationJobType.Project &&
    //   currentPerson.roleType === Role.DESIGNER
    // )
    //   flagHidden = true;
    if (!flagHidden) {
      return (
        <TextFieldJobComment
          getComments={getComments}
          visibleType={visibleType}
          label="Thêm bình luận..."
        />
      );
    }
  };
  return (
    <div className="flex flex-col gap-4">
      {comments && comments.length > 0
        ? comments
            // .sort((a, b) => a.createdTime - b.createdTime)
            .map(comment => {
              if (!comment.replyComment)
                return (
                  <div key={comment.commentId}>
                    <Comment
                      visibleType={visibleType}
                      getComments={getComments}
                      setComments={setComments}
                      handleHideComment={handleHideComment}
                      {...comment}
                    />
                  </div>
                );
              else {
                return (
                  <ReplyComment
                    parentUser={comment.replyComment.user}
                    parentContent={comment.replyComment.content}
                    visibleType={visibleType}
                    getAllReply={getComments}
                    key={comment.commentId}
                    handleHideComment={handleHideComment}
                    {...comment}
                  />
                );
              }
            })
        : ""}
      {renderAddComment()}
    </div>
  );
};

export default CommentSection;
