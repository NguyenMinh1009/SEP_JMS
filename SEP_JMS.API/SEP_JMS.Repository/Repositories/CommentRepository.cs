using Microsoft.EntityFrameworkCore;
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

        public Task<PagingModel<Tuple<Comment, User, Comment, User>>> GetComments(CommentFilterRequestModel model)
        {
            throw new NotImplementedException();
        }

        public Task HideComment(Guid commentId, CommentStatus status)
        {
            throw new NotImplementedException();
        }
    }
}
