using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model.Api.Request.Comment;

namespace SEP_JMS.Service.IServices
{
    public interface ICommentService
    {
        public Task<Comment?> GetComment(Guid commentId);

        public Task<int> UpdateComment(Comment comment);

        public Task<bool> CreateComment(Guid jobId, CommentCreateRequestModel model);

        public Task<PagingModel<CommentDetailsDisplayModel>?> GetComments(CommentFilterRequestModel model);

        public Task HideComment(Guid commentId, CommentStatus status);

        public Task<Comment?> GetCommentByCorrelationJobId(Guid jobId, Guid commentId, VisibleType visible);
    }
}
