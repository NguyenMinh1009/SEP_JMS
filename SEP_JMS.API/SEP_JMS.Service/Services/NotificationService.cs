using AutoMapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SEP_JMS.Common;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SEP_JMS.Service.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository notificationRepository;
        private readonly IUserRepository userRepository;
        private readonly IJobRepository jobRepository;
        private readonly ICompanyRepository companyRepository;
        private readonly IJobTypeRepository jobTypeRepository;
        private readonly ICommentRepository commentRepository;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;
        public NotificationService(IMapper mapper, IJMSLogger logger, INotificationRepository notificationRepository, IUserRepository userRepository, IJobRepository jobRepository, ICompanyRepository companyRepository, IJobTypeRepository jobTypeRepository, ICommentRepository commentRepository)
        {
            this.notificationRepository = notificationRepository;
            this.mapper = mapper;
            this.logger = logger;
            this.userRepository = userRepository;
            this.jobRepository = jobRepository;
            this.companyRepository = companyRepository;
            this.jobTypeRepository = jobTypeRepository;
            this.commentRepository = commentRepository;
        }
        public async Task<Guid> CreateNotification(NotiCreationRequest model, NotiAction action)
        {
            var receivers = await userRepository.GetAll(user=>model.Receiver==user.UserId);
            var user = receivers.FirstOrDefault();
            var firstMess = ApiContext.Current.UserId == model.Receiver ? "Bạn" : $"[{ApiContext.Current.Username}]";
            model.Message = GenerateMassage(action, firstMess, model);
            var notiConfig = user != null ? JsonConvert.DeserializeObject<List<NotiType>>(user.NotificationConfig) : null;
            if (notiConfig == null || !notiConfig.Contains(model.NotiType))
            {
                return Guid.Empty;
            }
            var notiModel = mapper.Map<Notification>(model);
            var notification = await notificationRepository.Add(notiModel);
            return notification.NotificationId;
        }
        public async Task<Tuple<int,PagingModel<NotificationResponse>>> GetNotifications(NotificationFilterRequest requestModel)
        {
            var notificationEntity = await notificationRepository.GetNotifications(requestModel);
            var notifications = mapper.Map<List<NotificationResponse>>(notificationEntity.Item2.Items);
            return new Tuple<int, PagingModel<NotificationResponse>>(notificationEntity.Item1, new PagingModel<NotificationResponse>()
            {
                Items = notifications,
                Count = notificationEntity.Item2.Count
            });
        }
        public async Task ConfigureNotification(List<NotiType> types)
        {
            await userRepository.UpdateNotiConfiguration(ApiContext.Current.UserId, types);
        }
        public async Task DeleteNotification(Guid id)
        {
            await notificationRepository.DeleteNotification(id);
        }
        public async Task ReadNotification(Guid id)
        {
            await notificationRepository.UpdateReadTime(id);
        }
        public async Task ArchiveNotification(Guid id)
        {
            await notificationRepository.UpdateArchivedTime(id, false);
        }
        public async Task ReadAllNotification()
        {
            await notificationRepository.UpdateReadTime(Guid.Empty, true);
        }

        private string GenerateMassage(NotiAction action, string userName, NotiCreationRequest notiReq)
        {
            switch (action)
            {
                case NotiAction.CreateJob:
                    return $"{userName} đã {(notiReq.EntityName.Equals("CreateJob") ? ActionConstants.CreateJob : ActionConstants.CreateProject)}";
                case NotiAction.UpdateJob:
                    return $"{userName} đã {(notiReq.EntityName.Equals("UpdateJob") ? ActionConstants.UpdateJob : ActionConstants.UpdateProject)}";
                case NotiAction.Comment:
                    return $"{userName} đã {ActionConstants.Comment}";
                default:
                    break;
            }
            return null!;
        }

        public async Task UnArchiveNotification(Guid id)
        {
            await notificationRepository.UpdateArchivedTime(id, true);
        }

        public async Task DeleteByEntityId(Guid entityId)
        {
            await notificationRepository.DeleteByEntityId(entityId);
        }

        public async Task DeleteByReceiver(Guid entityId, Guid receiverId)
        {
            await notificationRepository.DeleteByReceiver(entityId, receiverId);
        }

        public async Task UpdateTitle(Guid entityId, string newTitle)
        {
            await notificationRepository.UpdateTitle(entityId, newTitle);
        }

        public async Task DeleteByReceiver(Guid receiverId)
        {
            await notificationRepository.DeleteByReceiver(receiverId);
        }

        public async Task<Guid> Trigger(Guid jobId, Job? oldJob, string? commentContent, NotiAction action)
        {
            var newLineChar = "<br>";
            var recvIds = new List<Guid?>();
            var recvUsers = new List<User>();
            var notiType = commentContent == null ? NotiType.FromJob : NotiType.FromComment;

            // get receivers
            var job = await jobRepository.Get(jobId);
            if (job == null) return Guid.Empty;
            recvIds.Add(job.AccountId);
            recvIds.Add(job.DesignerId);
            recvIds.Add(job.CustomerId);
            recvIds.Add(job.CreatedBy);
            recvIds.Add(ApiContext.Current.UserId);
            recvIds = recvIds.Distinct().ToList();

            var rcv = recvIds.Where(id => id != null).ToList();
            foreach (var id in rcv)
            {

                var usr = await userRepository.Get(id ?? Guid.Empty);
                var notiConfig = usr != null ? JsonConvert.DeserializeObject<List<NotiType>>(usr.NotificationConfig) : null;
                if (usr != null && notiConfig != null && notiConfig.Contains(notiType))
                {
                    recvUsers.Add(usr);
                }

            };

            if (action == NotiAction.CreateJob)
            {
                // create notification
                // gen notify data
                var cust = await userRepository.Get(job.CustomerId);
                var account = await userRepository.Get(job.AccountId);
                var designer = await userRepository.Get(job.DesignerId ?? Guid.Empty);
                var creator = await userRepository.Get(ApiContext.Current.UserId);
                var comp = await companyRepository.GetCompany(cust?.CompanyId ?? Guid.Empty);
                var jType = await jobTypeRepository.Get(job.JobType);

                foreach (var user in recvUsers)
                {
                    var notify = new Notification();
                    notify.NotificationId = Guid.NewGuid();
                    notify.EntityIdentifier = job.JobId;
                    notify.EntityName = "Tạo mới / " + Enum.GetName(typeof(CorrelationJobType), job.CorrelationType);
                    notify.Title = job.Title;
                    notify.Message = ApiContext.Current.UserId == user.UserId ? "Bạn" : $"{creator?.Fullname} <{creator?.Username}>";
                    notify.Message += " đã tạo một công việc mới";


                    notify.Data = $"Khách hàng: {comp?.CompanyName}" + newLineChar;
                    notify.Data += $"Người Order: {cust?.Fullname} [{cust?.Username}]" + newLineChar;
                    notify.Data += $"Quản lí: {account?.Fullname} [{account?.Username}]" + newLineChar;
                    notify.Data += $"Designer: {designer?.Fullname} [{designer?.Username}]" + newLineChar;
                    notify.Data += $"Loại thiết kế: {jType?.TypeName}" + newLineChar;
                    notify.Data += $"Deadline: {new DateTime(job.Deadline)}" + newLineChar;
                    notify.Data += $"Độ ưu tiên: {Enum.GetName(typeof(Priority), job.Priority)}" + newLineChar;
                    notify.Data += $"Số lượng: {job.Quantity}" + newLineChar;
                    notify.Data += $"Trạng thái: {Enum.GetName(typeof(JobStatus), job.JobStatus)}" + newLineChar;
                    notify.Data += $"Mô tả: ..." + newLineChar;

                    notify.TriggerBy = ApiContext.Current.UserId;
                    notify.Receiver = user.UserId;
                    notify.CreatedTime = DateTime.UtcNow.Ticks;

                    await notificationRepository.Add(notify);
                }

            }

            if (action == NotiAction.UpdateJob && oldJob!= null && job != null)
            {
                var cust = await userRepository.Get(job.CustomerId);
                var account = await userRepository.Get(job.AccountId);
                var designer = await userRepository.Get(job.DesignerId??Guid.Empty);
                var jType = await jobTypeRepository.Get(job.JobType);
                var oldCust = await userRepository.Get(oldJob.CustomerId);
                var oldAccount = await userRepository.Get(oldJob.AccountId);
                var oldDesigner = await userRepository.Get(oldJob.DesignerId?? Guid.Empty);
                var oldJType = await jobTypeRepository.Get(oldJob.JobType);
       
                var creator = await userRepository.Get(ApiContext.Current.UserId);

                foreach (var user in recvUsers)
                {
                    var notify = new Notification();
                    notify.NotificationId = Guid.NewGuid();
                    notify.EntityIdentifier = job.JobId;
                    notify.EntityName = "Cập nhật / " + Enum.GetName(typeof(CorrelationJobType), job.CorrelationType);
                    notify.Title = job.Title;
                    notify.Message = ApiContext.Current.UserId == user.UserId ? "Bạn" : $"{creator?.Fullname} <{creator?.Username}>";
                    notify.Message += " đã cập nhật công việc";
                    notify.Data = "";

                    // delete old receivers
                    if (!oldJob.Title.Equals(job.Title))
                    {
                        notify.Data += $"Tiêu đề: [{oldJob?.Title}] --> [{job?.Title}]" + newLineChar;
                    }

                    if (!oldJob.Description.Equals(job.Description))
                    {
                        notify.Data += $"Mô tả: [] --> []" + newLineChar;
                    }

                    if (oldJob.AccountId != job.AccountId) {
                        await notificationRepository.DeleteByReceiver(oldJob.AccountId);
                        notify.Data += $"Người quản lí: {oldAccount?.Fullname} [{oldAccount?.Username}] --> {account?.Fullname} [{account?.Username}]" + newLineChar;
                    }

                    if (oldJob.DesignerId != job.DesignerId)
                    {
                        await notificationRepository.DeleteByReceiver(oldJob.DesignerId??Guid.Empty);
                        notify.Data += $"Designer: {oldDesigner?.Fullname} [{oldDesigner?.Username}] --> {designer?.Fullname} [{designer?.Username}]" + newLineChar;
                    }

                    if (oldJob.JobType != job.JobType)
                    {
                        notify.Data += $"Loại thiết kế: {oldJType?.TypeName} --> {jType?.TypeName}" + newLineChar;
                    }

                    if (oldJob.Priority != job.Priority)
                    {

                        notify.Data += $"Độ ưu tiên: {Enum.GetName(typeof(Priority), oldJob.Priority)} --> {Enum.GetName(typeof(Priority), job.Priority)}" + newLineChar;
                    }

                    if (oldJob.Quantity != job.Quantity)
                    {
                        notify.Data += $"Số lượng: {oldJob.Quantity} --> {job.Quantity}" + newLineChar;
                    }

                    if (oldJob.Deadline != job.Deadline)
                    {
                        notify.Data += $"Deadline: {new DateTime(oldJob.Deadline)} --> {new DateTime(job.Deadline)}" + newLineChar;
                    }

                    if (oldJob.JobStatus != job.JobStatus)
                    {
                        notify.Data += $"Trạng thái: {Enum.GetName(typeof(JobStatus), oldJob.JobStatus)} --> {Enum.GetName(typeof(JobStatus), job.JobStatus)}" + newLineChar;
                    }

                    notify.TriggerBy = ApiContext.Current.UserId;
                    notify.Receiver = user.UserId;
                    notify.CreatedTime = DateTime.UtcNow.Ticks;

                    await notificationRepository.Add(notify);
                }

                
            }

            if (action == NotiAction.Comment && commentContent != null)
            {
                var creator = await userRepository.Get(ApiContext.Current.UserId);
                
                foreach (var user in recvUsers)
                {
                    var notify = new Notification();
                    notify.NotificationId = Guid.NewGuid();
                    notify.EntityIdentifier = job.JobId;
                    notify.EntityName = "Bình luận / " + Enum.GetName(typeof(CorrelationJobType), job.CorrelationType);
                    notify.Title = job.Title;
                    notify.Message = ApiContext.Current.UserId == user.UserId ? "Bạn" : $"{creator?.Fullname} ({creator?.Username})";
                    notify.Message += " vừa bình luận trong công việc";


                    notify.Data = commentContent ?? "";
                    

                    notify.TriggerBy = ApiContext.Current.UserId;
                    notify.Receiver = user.UserId;
                    notify.CreatedTime = DateTime.UtcNow.Ticks;

                    await notificationRepository.Add(notify);
                }
            }
            return Guid.Empty;
        }
    }
}
