using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Common.Converters;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Repository.IRepositories;
using System.Data;

namespace SEP_JMS.Repository.Repositories
{
    public class JobRepository : BaseRepository<Job>, IJobRepository
    {
        public JobRepository(JSMContext context) : base(context)
        {
        }

        public async Task<PagingModel<Job>> GetProjects(ProjectFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs
                        where job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin
                        select job;

            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = query.Where(job => job.Title.ToLower().Contains(model.SearchText.ToLower()));
            }

            var jobs = await query.Where(job => job.CorrelationType == CorrelationJobType.Project)
                .OrderByDescending(job => job.CreatedTime)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Job>
            {
                Items = jobs,
                Count = count
            };
        }

        public async Task<PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>> GetAllJobs(JobFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs

                        join createdUser in Context.Users
                        on job.CreatedBy equals createdUser.UserId
                        into createdUsers
                        from createdUser in createdUsers.DefaultIfEmpty()

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId
                        into customers
                        from customer in customers.DefaultIfEmpty()

                        join account in Context.Users
                        on job.AccountId equals account.UserId
                        into accounts
                        from account in accounts.DefaultIfEmpty()

                        join designer in Context.Users
                        on job.DesignerId equals designer.UserId
                        into designers
                        from designer in designers.DefaultIfEmpty()

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        join jobType in Context.TypeOfJobs
                        on job.JobType equals jobType.TypeId
                        into jobTypes
                        from jobType in jobTypes.DefaultIfEmpty()

                        where job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin
                        select new { job, createdUser, customer, account, designer, company, jobType };
            if (model.ParentId != null)
            {
                query = query.Where(d => d.job.ParentId == model.ParentId.Value);
            }
            else
            {
                query = query.Where(d => d.job.ParentId == null);
            }
            if (model.CorrelationType != null)
            {
                query = query.Where(d => d.job.CorrelationType == model.CorrelationType.Value);
            }
            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.job.Title.ToLower().Contains(model.SearchText.ToLower())
                        select data;
            }
            if (model.JobStatus != null)
            {
                if (model.ParentId == null)
                {
                    query = from data in query
                                    where data.job.JobStatus == JobStatus.Completed
                                    select data;
                }
                else
                {
                    query = from data in query
                            where data.job.JobStatus == JobStatus.Completed
                            select data;
                }
                }
            else
            {
                
                if (model.ParentId == null) 
                {
                    query = from data in query
                           where data.job.JobStatus != JobStatus.Completed
                          select data;
                }
                else 
                {
                    query = from data in query
                            select data;
                }
            }
            if (model.AccountId != null)
            {
                query = from data in query
                        where data.job.AccountId == model.AccountId
                        select data;
            }
            if (model.CompanyId != null)
            {
                query = from data in query
                        where data.company.CompanyId == model.CompanyId
                        select data;
            }
            if (model.DesignerId != null)
            {
                query = from data in query
                        where data.job.DesignerId == model.DesignerId
                        select data;
            }
            if (model.From != null)
            {
                query = from data in query
                        where data.job.CreatedTime >= model.From
                        select data;
            }
            if (model.To != null)
            {
                query = from data in query
                        where data.job.CreatedTime <= model.To
                        select data;
            }
            if (model.Priority != null)
            {
                query = from data in query
                        where data.job.Priority == model.Priority
                        select data;
            }
            if (model.CustomerId.HasValue)
            {
                query = from data in query
                        where data.job.CustomerId == model.CustomerId.Value
                        select data;
            }
            if (model.CreatedBy.HasValue)
            {
                query = from data in query
                        where data.job.CreatedBy == model.CreatedBy.Value
                        select data;
            }
            if (model.JobType.HasValue)
            {
                query = from data in query
                        where data.job.JobType == model.JobType.Value
                        select data;
            }
            var jobs = await query.OrderByDescending(data => data.job.CreatedTime)
                            .Skip((model.PageIndex - 1) * model.PageSize)
                            .Take(model.PageSize)
                            .Select(data => Tuple.Create(data.job, data.createdUser, data.customer, data.account, data.designer, data.company, data.jobType))
                            .AsNoTracking()
                            .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>
            {
                Items = jobs,
                Count = count
            };
        }

        public async Task<PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>> GetAllJobs(InternalJobFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs

                        join createdUser in Context.Users
                        on job.CreatedBy equals createdUser.UserId
                        into createdUsers
                        from createdUser in createdUsers.DefaultIfEmpty()

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId
                        into customers
                        from customer in customers.DefaultIfEmpty()

                        join account in Context.Users
                        on job.AccountId equals account.UserId
                        into accounts
                        from account in accounts.DefaultIfEmpty()

                        join designer in Context.Users
                        on job.DesignerId equals designer.UserId
                        into designers
                        from designer in designers.DefaultIfEmpty()

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        join jobType in Context.TypeOfJobs
                        on job.JobType equals jobType.TypeId
                        into jobTypes
                        from jobType in jobTypes.DefaultIfEmpty()

                        where job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin
                        select new { job, createdUser, customer, account, designer, company, jobType };
            if (model.ParentId != null)
            {
                query = query.Where(d => d.job.ParentId == model.ParentId.Value);
            }
            if (model.CorrelationType != null)
            {
                query = query.Where(d => d.job.CorrelationType == model.CorrelationType.Value);
            }

            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.job.Title.ToLower().Contains(model.SearchText.ToLower())
                        select data;
            }
            if (model.InternalJobStatus != null)
            {
                query = from data in query
                        where data.job.InternalJobStatus == model.InternalJobStatus
                        select data;
            }
            else
            {
                query = from data in query
                        where data.job.JobStatus != JobStatus.Completed
                        select data;
            }
            if (model.AccountId != null)
            {
                query = from data in query
                        where data.job.AccountId == model.AccountId
                        select data;
            }
            if (model.CompanyId != null)
            {
                query = from data in query
                        where data.company.CompanyId == model.CompanyId
                        select data;
            }
            if (model.DesignerId != null)
            {
                query = from data in query
                        where data.job.DesignerId == model.DesignerId
                        select data;
            }
            if (model.From != null)
            {
                query = from data in query
                        where data.job.CreatedTime >= model.From
                        select data;
            }
            if (model.To != null)
            {
                query = from data in query
                        where data.job.CreatedTime <= model.To
                        select data;
            }
            if (model.Priority != null)
            {
                query = from data in query
                        where data.job.Priority == model.Priority
                        select data;
            }
            if (model.CustomerId.HasValue)
            {
                query = from data in query
                        where data.job.CustomerId == model.CustomerId.Value
                        select data;
            }
            if (model.CreatedBy.HasValue)
            {
                query = from data in query
                        where data.job.CreatedBy == model.CreatedBy.Value
                        select data;
            }
            if (model.JobType.HasValue)
            {
                query = from data in query
                        where data.job.JobType == model.JobType.Value
                        select data;
            }
            var jobs = await query.OrderByDescending(data => data.job.CreatedTime)
                            .Skip((model.PageIndex - 1) * model.PageSize)
                            .Take(model.PageSize)
                            .Select(data => Tuple.Create(data.job, data.createdUser, data.customer, data.account, data.designer, data.company, data.jobType))
                            .AsNoTracking()
                            .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>
            {
                Items = jobs,
                Count = count
            };
        }

        public async Task<Tuple<Job, User, User, User, User, Company, JobType>?> GetJob(Guid jobId)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs

                        join createdUser in Context.Users
                        on job.CreatedBy equals createdUser.UserId
                        into createdUsers
                        from createdUser in createdUsers.DefaultIfEmpty()

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId
                        into customers
                        from customer in customers.DefaultIfEmpty()

                        join account in Context.Users
                        on job.AccountId equals account.UserId
                        into accounts
                        from account in accounts.DefaultIfEmpty()

                        join designer in Context.Users
                        on job.DesignerId equals designer.UserId
                        into designers
                        from designer in designers.DefaultIfEmpty()

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        join jobType in Context.TypeOfJobs
                       on job.JobType equals jobType.TypeId
                       into jobTypes
                        from jobType in jobTypes.DefaultIfEmpty()

                        where job.JobId == jobId &&
                        (job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin)
                        select Tuple.Create(job, createdUser, customer, account, designer, company, jobType);

            return await query.AsNoTracking().FirstOrDefaultAsync();
        }

        public async Task<Job?> GetBasicJob(Guid jobId)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs
                        where job.JobId == jobId &&
                        (job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin)
                        select job;

            return await query.AsNoTracking().FirstOrDefaultAsync();
        }

        public async Task<Job?> UpdateDesignerJob(Guid jobId, UpdateJobDesignerRequest model)
        {
            var desId = ApiContext.Current.UserId;
            var query = from job in Context.Jobs
                        where job.DesignerId == desId && job.JobId == jobId
                        select job;

            var currentJob = await query.FirstAsync();
            if (currentJob.JobStatus == JobStatus.Pending || currentJob.JobStatus == JobStatus.Completed) return null;

            var now = DateTime.UtcNow.Ticks;

            currentJob.JobStatus = model.JobStatus;
            currentJob.FinalLink = model.FinalLink;
            currentJob.LastUpdated = now;

            currentJob.InternalJobStatus = model.JobStatus.ToInternalJobStatus();
            currentJob.InternalLastUpdated = now;

            Context.Jobs.Update(currentJob);
            await Context.SaveChangesAsync();
            Context.Entry(currentJob).State = EntityState.Detached;
            return currentJob;
        }

        public async Task<Job?> UpdateJob(Guid jobId, UpdateJobRequest model)
        {
            if (model.CorrelationType == CorrelationJobType.Project && model.ParentId != null)
                throw new ArgumentException("project can't have parent id");

            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs
                        where job.JobId == jobId && (job.AccountId == userId || job.CustomerId == userId || role == RoleType.Admin)
                        select job;

            var currentJob = await query.FirstAsync();
            if (currentJob.JobStatus == JobStatus.Completed && role != RoleType.Admin) return null;

            var now = DateTime.UtcNow.Ticks;

            currentJob.Title = model.Title;
            currentJob.Description = model.Description;
            currentJob.Quantity = model.Quantity;
            currentJob.JobType = model.JobType;
            currentJob.Deadline = model.Deadline;
            currentJob.Priority = model.Priority;
            currentJob.JobStatus = model.JobStatus;
            currentJob.DesignerId = model.DesignerId ?? currentJob.DesignerId;
            currentJob.AccountId = model.AccountId ?? currentJob.AccountId;

            currentJob.LastUpdated = now;
            currentJob.CorrelationType = model.CorrelationType;
            currentJob.FinalLink = model.FinalLink;
            currentJob.InternalJobStatus = model.JobStatus.ToInternalJobStatus();
            currentJob.InternalLastUpdated = now;

            Context.Jobs.Update(currentJob);
            await Context.SaveChangesAsync();
            Context.Entry(currentJob).State = EntityState.Detached;
            return currentJob;
        }   

        public async Task UpdateFinalProductsToLocal(Guid jobId, FolderItem finalFolder)
        {
            var final = JsonConvert.SerializeObject(finalFolder);
            await Context.Jobs.Where(job => job.JobId == jobId)
                .ExecuteUpdateAsync(jobs => jobs
                .SetProperty(job => job.FinalProducts, job => final));
        }

        public async Task UpdatePreviewProductsToLocal(Guid jobId, FolderItem requirementFolder)
        {
            var preview = JsonConvert.SerializeObject(requirementFolder);
            await Context.Jobs.Where(job => job.JobId == jobId)
                .ExecuteUpdateAsync(jobs => jobs
                .SetProperty(job => job.FinalPreview, job => preview));
        }

        public async Task UpdateRequirementProductsToLocal(Guid jobId, FolderItem requirementFolder)
        {
            var requirement = JsonConvert.SerializeObject(requirementFolder);
            await Context.Jobs.Where(job => job.JobId == jobId)
                .ExecuteUpdateAsync(jobs => jobs
                .SetProperty(job => job.Requirements, job => requirement));
        }

        public async Task UpdateJobLastUpdatedTime(Guid jobId, long time)
        {
            var job = await Context.Jobs.Where(job => job.JobId == jobId).FirstAsync();
            job.LastUpdated = time;
            job.InternalLastUpdated = time;
            await Context.SaveChangesAsync();
        }

        public async Task UpdateInternalJobLastUpdatedTime(Guid jobId, long time)
        {
            var job = await Context.Jobs.Where(job => job.JobId == jobId).FirstAsync();
            job.InternalLastUpdated = time;
            await Context.SaveChangesAsync();
        }

        public async Task UpdateInternalJobStatus(Guid jobId, InternalJobStatus internalJobStatus)
        {
            var job = await Context.Jobs
                .SingleAsync(job => job.JobId == jobId);
            job.InternalJobStatus = internalJobStatus;
            job.JobStatus = internalJobStatus.ToJobStatus();
            await Context.SaveChangesAsync();
        }

        public async Task AssignJob(AssignJobRequest model)
        {
            var internalJob = await Context.Jobs.FirstAsync(job => job.JobId == model.JobId);
            internalJob.DesignerId = model.DesignerId;
            await Context.SaveChangesAsync();
        }

        public async Task Delete(Guid jobId)
        {
            using var transaction = await Context.Database.BeginTransactionAsync();
            try
            {
                _ = await Context.Comments.Where(com => com.CorrelationJobId == jobId)
                    .ExecuteDeleteAsync();
                _ = await Context.Jobs.Where(job => job.JobId == jobId).ExecuteDeleteAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<Tuple<Job, Company>>> GetAllJobsForExport(ExportJobRequest model)
        {
            var query = from job in Context.Jobs

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId

                        where job.JobStatus == JobStatus.Completed
                        select new { job, company };

            if (model.CorrelationType != null)
            {
                query = query.Where(d => d.job.CorrelationType == model.CorrelationType.Value);
            }
            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.job.Title.ToLower().Contains(model.SearchText.ToLower())
                        select data;
            }
            if (model.AccountId != null)
            {
                query = from data in query
                        where data.job.AccountId == model.AccountId
                        select data;
            }
            if (model.CompanyId != null)
            {
                query = from data in query
                        where data.company.CompanyId == model.CompanyId
                        select data;
            }
            if (model.DesignerId != null)
            {
                query = from data in query
                        where data.job.DesignerId == model.DesignerId
                        select data;
            }
            if (model.From != null)
            {
                query = from data in query
                        where data.job.CreatedTime >= model.From
                        select data;
            }
            if (model.To != null)
            {
                query = from data in query
                        where data.job.CreatedTime <= model.To
                        select data;
            }
            if (model.Priority != null)
            {
                query = from data in query
                        where data.job.Priority == model.Priority
                        select data;
            }
            if (model.CustomerId.HasValue)
            {
                query = from data in query
                        where data.job.CustomerId == model.CustomerId.Value
                        select data;
            }
            if (model.CreatedBy.HasValue)
            {
                query = from data in query
                        where data.job.CreatedBy == model.CreatedBy.Value
                        select data;
            }
            if (model.JobType.HasValue)
            {
                query = from data in query
                        where data.job.JobType == model.JobType.Value
                        select data;
            }
            return await query.OrderByDescending(data => data.job.CreatedTime)
                .Select(data => Tuple.Create(data.job, data.company))
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<PagingModel<Tuple<Job, User, User, User, User, Company>>> GetAllJobs(InternalJobFilterRequestModel model)
        {
            var userId = ApiContext.Current.UserId;
            var role = ApiContext.Current.Role;
            var query = from job in Context.Jobs

                        join createdUser in Context.Users
                        on job.CreatedBy equals createdUser.UserId
                        into createdUsers
                        from createdUser in createdUsers.DefaultIfEmpty()

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId
                        into customers
                        from customer in customers.DefaultIfEmpty()

                        join account in Context.Users
                        on job.AccountId equals account.UserId
                        into accounts
                        from account in accounts.DefaultIfEmpty()

                        join designer in Context.Users
                        on job.DesignerId equals designer.UserId
                        into designers
                        from designer in designers.DefaultIfEmpty()

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        where job.AccountId == userId || job.DesignerId == userId || job.CustomerId == userId || role == RoleType.Admin
                        select new { job, createdUser, customer, account, designer, company };
            if (model.CorrelationType != null)
            {
                query = query.Where(d => d.job.CorrelationType == model.CorrelationType.Value);
            }

            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.job.Title.ToLower().Contains(model.SearchText.ToLower())
                        select data;
            }
            if (model.InternalJobStatus != null)
            {
                query = from data in query
                        where data.job.InternalJobStatus == model.InternalJobStatus
                        select data;
            }
            else
            {
                query = from data in query
                        where data.job.JobStatus != JobStatus.Completed
                        select data;
            }
            if (model.AccountId != null)
            {
                query = from data in query
                        where data.job.AccountId == model.AccountId
                        select data;
            }
            if (model.CompanyId != null)
            {
                query = from data in query
                        where data.company.CompanyId == model.CompanyId
                        select data;
            }
            if (model.DesignerId != null)
            {
                query = from data in query
                        where data.job.DesignerId == model.DesignerId
                        select data;
            }
            if (model.From != null)
            {
                query = from data in query
                        where data.job.CreatedTime >= model.From
                        select data;
            }
            if (model.To != null)
            {
                query = from data in query
                        where data.job.CreatedTime <= model.To
                        select data;
            }
            if (model.Priority != null)
            {
                query = from data in query
                        where data.job.Priority == model.Priority
                        select data;
            }
            if (model.CustomerId.HasValue)
            {
                query = from data in query
                        where data.job.CustomerId == model.CustomerId.Value
                        select data;
            }
            if (model.CreatedBy.HasValue)
            {
                query = from data in query
                        where data.job.CreatedBy == model.CreatedBy.Value
                        select data;
            }
            if (model.JobType != null && model.JobType != Guid.Empty)
            {
                query = from data in query
                        where data.job.JobType == model.JobType
                        select data;
            }
            var jobs = await query.OrderByDescending(data => data.job.CreatedTime)
                            .Skip((model.PageIndex - 1) * model.PageSize)
                            .Take(model.PageSize)
                            .Select(data => Tuple.Create(data.job, data.createdUser, data.customer, data.account, data.designer, data.company))
                            .AsNoTracking()
                            .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<Job, User, User, User, User, Company>>
            {
                Items = jobs,
                Count = count
            };
        }

        public async Task<List<Tuple<Company, long, int>>> GetJobStatistics(StatisticsJobRequest model, JobStatus? jobStatus)
        {
            var jobQuery = Context.Jobs.AsQueryable();
            if (model.From != null)
            {
                jobQuery = from data in jobQuery
                           where data.CreatedTime >= model.From.Value
                           select data;
            }
            if (model.To != null)
            {
                jobQuery = from data in jobQuery
                           where data.CreatedTime <= model.To.Value
                           select data;
            }
            if (jobStatus.HasValue)
            {
                jobQuery = from data in jobQuery
                           where data.JobStatus == jobStatus.Value
                           select data;
            }

            var query = from job in jobQuery

                        join customer in Context.Users
                        on job.CustomerId equals customer.UserId

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId

                        join price in Context.Prices
                        on company.PriceGroupId equals price.PriceGroupId
                        where price.JobTypeId == job.JobType

                        group new { job, price, company } by company.CompanyId into groupData

                        select Tuple.Create(groupData.First().company, groupData.Sum(info => (long)info.price.UnitPrice * info.job.Quantity), groupData.Count());
            return await query.ToListAsync();
        }
    }
}
