using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SEP_JMS.Model.Api.Response;

namespace SEP_JMS.Service.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository commentRepository;
        private readonly ICompanyRepository companyRepository;
        private readonly IJobRepository jobRepository;

        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public CommentService(ICommentRepository commentRepository,
            ICompanyRepository companyRepository,
            IJobRepository jobRepository,

            IMapper mapper,
            IJMSLogger logger)
        {
            this.commentRepository = commentRepository;
            this.companyRepository = companyRepository;
            this.jobRepository = jobRepository;

            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<bool> CreateComment(Guid jobId, CommentCreateRequestModel model)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var rs = await GetCorelationJobUsers(jobId, model.VisibleType);
            var participants = rs.Item1;
            if (!participants.Any() || rs.Item2 == JobStatus.Completed && role != RoleType.Admin) return false;

            var comment = new Comment
            {
                CommentId = Guid.NewGuid(),
                Content = model.Content,
                CommentStatus = CommentStatus.Visible,
                CorrelationJobId = jobId,
                CreatedTime = DateTime.UtcNow.Ticks,
                ReplyCommentId = model.ReplyCommentId,
                UserId = userId,
                VisibleType = model.VisibleType
            };

            var folderModel = new FolderItem
            {
                Folder = comment.CommentId.ToString()
            };
            foreach (var file in model.Files)
            {
                var fileModel = await FileUtility.SaveFile(ApiConstants.CommentUploadFolder, comment.CommentId.ToString(), file);
                folderModel.Files.Add(fileModel);
            }
            comment.Attachments = JsonConvert.SerializeObject(folderModel);

            await commentRepository.CreateComment(comment);
            await jobRepository.UpdateJobLastUpdatedTime(jobId, DateTime.UtcNow.Ticks);
            return true;
        }

        public async Task<Comment?> GetCommentByCorrelationJobId(Guid jobId, Guid commentId, VisibleType visible)
        {
            return await commentRepository.GetCommentByCorrelationJobId(jobId, commentId, visible);
        }

        public async Task<PagingModel<CommentDetailsDisplayModel>?> GetComments(CommentFilterRequestModel model)
        {
            var rs = await GetCorelationJobUsers(model.JobId, model.VisibleType);
            if (!rs.Item1.Any()) return null;

            var commentsInfo = await commentRepository.GetComments(model);
            var comments = new List<CommentDetailsDisplayModel>();
            foreach (var commentInfo in commentsInfo.Items)
            {
                var comment = mapper.Map<CommentDetailsDisplayModel>(commentInfo.Item1);
                comment.User = mapper.Map<UserCommonDisplayModel>(commentInfo.Item2);
                if (commentInfo.Item3 != null && commentInfo.Item3.CommentStatus == CommentStatus.Visible)
                {
                    var reply = mapper.Map<ReplyCommentDetailsDisplayModel>(commentInfo.Item3);
                    reply.User = mapper.Map<UserCommonDisplayModel>(commentInfo.Item4);
                    comment.ReplyComment = reply;
                }
                comments.Add(comment);
            }

            return new PagingModel<CommentDetailsDisplayModel>
            {
                Items = comments,
                Count = commentsInfo.Count
            };
        }

        public async Task HideComment(Guid commentId, CommentStatus status)
        {
            await commentRepository.HideComment(commentId, status);
        }
        private async Task<Tuple<List<Guid>, JobStatus?>> GetCorelationJobUsers(Guid jobId, VisibleType visibleType)
        {
            var result = new List<Guid>();
            JobStatus? jobStatus = null;
            var job = await jobRepository.GetBasicJob(jobId);
            if (job != null)
            {
                jobStatus = job.JobStatus;
                result.Add(job.AccountId);
                if (visibleType == VisibleType.Public) result.Add(job.CustomerId);
                if (job.DesignerId != null) result.Add(job.DesignerId.Value);
            }
            return Tuple.Create(result, jobStatus);
        }
    }
}
