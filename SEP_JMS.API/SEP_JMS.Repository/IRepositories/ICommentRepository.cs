using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;

namespace SEP_JMS.Repository.IRepositories
{
    public interface ICommentRepository : IBaseRepository<Comment>
    {
        public Task CreateComment(Comment comment);

        /// <summary>
        /// Comment - User Commented
        /// </summary>
        /// <param name="role"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<PagingModel<Tuple<Comment, User, Comment, User>>> GetComments(CommentFilterRequestModel model);

        public Task HideComment(Guid commentId, CommentStatus status);

        public Task<Comment?> GetCommentByCorrelationJobId(Guid jobId, Guid commentId, VisibleType visible);
    }
}
