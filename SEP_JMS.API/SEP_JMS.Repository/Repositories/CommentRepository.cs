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
    public class CommentRepository : BaseRepository<Comment>, ICommentRepository
    {
        public CommentRepository(JSMContext dbcontext) : base(dbcontext)
        {

        }

        public async Task CreateComment(Comment comment)
        {
            await Context.Comments.AddAsync(comment);
            await Context.SaveChangesAsync();
        }

        public async Task<Comment?> GetCommentByCorrelationJobId(Guid jobId, Guid commentId, VisibleType visible)
        {
            return await Context.Comments.Where(comment => comment.CorrelationJobId == jobId
                && comment.CommentId == commentId && comment.VisibleType == visible).AsNoTracking().SingleOrDefaultAsync();
        }

        public async Task<PagingModel<Tuple<Comment, User, Comment, User>>> GetComments(CommentFilterRequestModel model)
        {
            var role = ApiContext.Current.Role;
            var query = from comment in Context.Comments
                        join user in Context.Users
                        on comment.UserId equals user.UserId
                        into users

                        from user in users.DefaultIfEmpty()
                        join replyComment in Context.Comments
                        on comment.ReplyCommentId equals replyComment.CommentId
                        into replyComments

                        from replyComment in replyComments.DefaultIfEmpty()
                        join replyCommentUser in Context.Users
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

        public async Task DeleteComments(Guid jobId)
        {
            await Context.Comments.Where(c => c.CorrelationJobId == jobId).ExecuteUpdateAsync(a => a.SetProperty(c => c.ReplyCommentId, c => null));
            await Context.Comments.Where(c => c.CorrelationJobId == jobId).ExecuteDeleteAsync();
        }

        public async Task HideComment(Guid commentId, CommentStatus status)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var comment = await Context.Comments.FirstAsync(comm => comm.CommentId == commentId
                    && (comm.UserId == userId || role == RoleType.Admin));

            var job = await Context.Jobs.Where(job => job.JobId == comment.CorrelationJobId).FirstAsync();
            var jobStatus = job.JobStatus;

            if (jobStatus == JobStatus.Completed && RoleType.Admin != role) throw new Exception("modify a completed job comment");
            else
            {
                comment.CommentStatus = status;
                await Context.SaveChangesAsync();
            }
        }
    }
}
