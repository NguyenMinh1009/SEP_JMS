using Microsoft.EntityFrameworkCore;
using SEP_JMS.Common;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Repository.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly JSMContext dbcontext;

        public CommentRepository(JSMContext dbcontext)
        {
            this.dbcontext = dbcontext;
        }

        public async Task CreateComment(Comment comment)
        {
            await dbcontext.Comments.AddAsync(comment);
            await dbcontext.SaveChangesAsync();
        }

        public async Task<Comment?> GetCommentByCorrelationJobId(Guid jobId, Guid commentId, VisibleType visible)
        {
            return await dbcontext.Comments.Where(comment => comment.CorrelationJobId == jobId
                && comment.CommentId == commentId && comment.VisibleType == visible).AsNoTracking().SingleOrDefaultAsync();
        }

        public async Task<PagingModel<Tuple<Comment, User, Comment, User>>> GetComments(CommentFilterRequestModel model)
        {
            var role = ApiContext.Current.Role;
            var query = from comment in dbcontext.Comments
                        join user in dbcontext.Users
                        on comment.UserId equals user.UserId
                        into users

                        from user in users.DefaultIfEmpty()
                        join replyComment in dbcontext.Comments
                        on comment.ReplyCommentId equals replyComment.CommentId
                        into replyComments

                        from replyComment in replyComments.DefaultIfEmpty()
                        join replyCommentUser in dbcontext.Users
                        on replyComment.UserId equals replyCommentUser.UserId
                        into replyCommentUsers

                        from replyCommentUser in replyCommentUsers.DefaultIfEmpty()
                        where comment.CorrelationJobId == model.JobId &&
                        (role == RoleType.Admin || comment.CommentStatus == CommentStatus.Visible)
                        && comment.VisibleType == model.VisibleType
                        select new { comment, user, replyComment, replyCommentUser };

            if (model.From != null)
            {
                query = from data in query
                        where data.comment.CreatedTime > model.From
                        select data;
            }
            if (model.To != null)
            {
                query = from data in query
                        where data.comment.CreatedTime < model.To
                        select data;
            }
            var comments = await query.OrderByDescending(data => data.comment.CreatedTime)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .Select(data => Tuple.Create(data.comment, data.user, data.replyComment, data.replyCommentUser))
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<Comment, User, Comment, User>>
            {
                Items = comments,
                Count = count
            };
        }

        public async Task HideComment(Guid commentId, CommentStatus status)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var comment = await dbcontext.Comments.FirstAsync(comm => comm.CommentId == commentId
                    && (comm.UserId == userId || role == RoleType.Admin));

            var job = await dbcontext.Jobs.Where(job => job.JobId == comment.CorrelationJobId).FirstAsync();
            var jobStatus = job.JobStatus;

            if (jobStatus == JobStatus.Completed && RoleType.Admin != role) throw new Exception("modify a completed job comment");
            else
            {
                comment.CommentStatus = status;
                await dbcontext.SaveChangesAsync();
            }
        }
    }
}
