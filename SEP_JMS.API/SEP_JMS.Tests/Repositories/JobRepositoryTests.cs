using SEP_JMS.Common;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Tests.Repositories
{
    public class JobRepositoryTests
    {
        private IJobRepository _jobRepository;

        private readonly List<Job> _testJobs = new();

        private readonly Guid _accountId1 = Guid.Parse("5ad1b793-e2a7-4af7-9190-5e32b9778dac");
        private readonly Guid _accountId2 = Guid.Parse("fcfc9fbb-70b8-4eb1-baf7-362248999a90");
        private readonly Guid _accountId3 = Guid.Parse("8709a1b2-7300-4dee-9c12-0cc094e26317");

        private readonly Guid _customerId1 = Guid.Parse("98a0500c-baa5-484a-bf7c-bc1da55659d4");
        private readonly Guid _customerId2 = Guid.Parse("f1df336f-524d-43ca-8b97-10a8f0522034");
        private readonly Guid _customerId3 = Guid.Parse("dcc5cecd-2d87-4af1-9c46-ab47e1b1a0e5");

        private readonly Guid _adminId1 = Guid.Parse("dacfa559-1223-4d40-9fb1-e6c3832ee2a3");
        private readonly Guid _adminId2 = Guid.Parse("f95505aa-ab70-4148-95bf-b9b644d4403f");
        private readonly Guid _adminId3 = Guid.Parse("99c2e82b-11b7-4cf6-8c5e-98667f431c4c");

        private readonly Guid _designerId1 = Guid.Parse("4ef9d8b2-5dd3-42f2-b9fa-65c458ea93ca");
        private readonly Guid _designerId2 = Guid.Parse("5e891e3b-531c-46f7-9d4e-6251a348e110");
        private readonly Guid _designerId3 = Guid.Parse("6d4a8439-b130-472c-87ab-2fc246efbb80");

        [SetUp]
        public async Task Setup()
        {
            _jobRepository = ContextGenerator.GetRepository<JobRepository, Job>();
            ContextGenerator.Instance.Jobs.RemoveRange(ContextGenerator.Instance.Jobs);
            await ContextGenerator.Instance.SaveChangesAsync();
            _testJobs.Clear();

            #region normal job
            var job1 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId1,
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CreatedBy = _accountId1,
                CustomerId = _customerId1,
                Description = "Test job 1",
                DesignerId = _designerId1,
                Title = "Test job title 1"
            };
            var job2 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId2,
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CreatedBy = _accountId2,
                CustomerId = _customerId2,
                Description = "Test job 2",
                DesignerId = _designerId2,
                Title = "Test job title 2"
            };
            var job3 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId1,
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CreatedBy = _accountId1,
                CustomerId = _customerId1,
                Description = "Test job 3",
                DesignerId = _designerId1,
                Title = "Test job title 3"
            };
            var project1 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId3,
                CorrelationType = Model.Enums.System.CorrelationJobType.Project,
                CreatedBy = _accountId3,
                CustomerId = _customerId3,
                Description = "Test project 1",
                Title = "Test project title 1"
            };
            var project2 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId2,
                CorrelationType = Model.Enums.System.CorrelationJobType.Project,
                CreatedBy = _accountId2,
                CustomerId = _customerId2,
                Description = "Test project 2",
                Title = "Test project title 2",
                JobStatus = Model.Enums.System.JobStatus.Completed,
                InternalJobStatus = Model.Enums.System.InternalJobStatus.Completed,
            };
            var project3 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId1,
                CorrelationType = Model.Enums.System.CorrelationJobType.Project,
                CreatedBy = _accountId1,
                CustomerId = _customerId2,
                Description = "Test project 3",
                Title = "Test project title 3",
                JobStatus = Model.Enums.System.JobStatus.Completed,
                InternalJobStatus = Model.Enums.System.InternalJobStatus.Completed,
            };
            var job1OfProject1 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId3,
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CreatedBy = _accountId3,
                CustomerId = _customerId3,
                Description = "Test sub job project 4 1",
                DesignerId = _designerId2,
                Title = "Test sub job project 4 title 1",
                ParentId  = project1.JobId
            };
            var job2OfProject1 = new Job
            {
                JobId = Guid.NewGuid(),
                AccountId = _accountId3,
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CreatedBy = _accountId3,
                CustomerId = _customerId3,
                Description = "Test sub job project 4 2",
                DesignerId = _designerId2,
                Title = "Test sub job project 4 title 2",
                JobStatus = Model.Enums.System.JobStatus.Completed,
                InternalJobStatus = Model.Enums.System.InternalJobStatus.Completed,
                ParentId  = project1.JobId
            };
            _testJobs.Add(job1);
            _testJobs.Add(job2);
            _testJobs.Add(job3);
            _testJobs.Add(project1);
            _testJobs.Add(project2);
            _testJobs.Add(job1OfProject1);
            _testJobs.Add(job2OfProject1);
            ContextGenerator.Instance.AddRange(_testJobs);
            await ContextGenerator.Instance.SaveChangesAsync();
            #endregion
        }

        #region Test Get All Projects
        [Test]
        public async Task GetProjects_WithAdmin1_ShouldReturnAll()
        {
            ApiContext.Current.UserId = _adminId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Admin;
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Project
            });
            var totalJob = _testJobs.Count(job => job.CorrelationType == Model.Enums.System.CorrelationJobType.Project
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.ParentId == null);
            Assert.That(results.Count, Is.EqualTo(totalJob));
        }

        [Test]
        public async Task GetProjects_WithAcount1_ShouldReturnOnlyProjectForAccount1()
        {
            ApiContext.Current.UserId = _accountId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Account;
            var count = _testJobs.Count(job => job.AccountId == _accountId1
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Project
                && job.ParentId == null);

            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Project
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetProjects_WithDesinger1_ShouldReturnOnlyProjectsForDesinger1()
        {
            ApiContext.Current.UserId = _designerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Designer;
            var count = _testJobs.Count(job => job.DesignerId == _designerId1
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Project
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Project
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetProjects_WithCustomer1_ShouldReturnOnlyProjectsForCustomer1()
        {
            ApiContext.Current.UserId = _customerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Customer;
            var count = _testJobs.Count(job => job.CustomerId == _customerId1
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Project
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Project
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }
        #endregion

        #region Test Get All Jobs
        [Test]
        public async Task GetJobs_WithAdmin1_ShouldReturnAll()
        {
            ApiContext.Current.UserId = _adminId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Admin;
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            });
            var totalJob = _testJobs.Count(job => job.CorrelationType == Model.Enums.System.CorrelationJobType.Job 
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.ParentId == null);
            Assert.That(results.Count, Is.EqualTo(totalJob));
        }

        [Test]
        public async Task GetJobs_WithAcount1_ShouldReturnOnlyJobForAccount1()
        {
            ApiContext.Current.UserId = _accountId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Account;
            var count = _testJobs.Count(job => job.AccountId == _accountId1 
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetJobs_WithDesinger1_ShouldReturnOnlyJobForDesinger1()
        {
            ApiContext.Current.UserId = _designerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Designer;
            var count = _testJobs.Count(job => job.DesignerId == _designerId1
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetJobs_WithCustomer1_ShouldReturnOnlyJobForCustomer1()
        {
            ApiContext.Current.UserId = _customerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Customer;
            var count = _testJobs.Count(job => job.CustomerId == _customerId1
                && job.JobStatus != Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }
        #endregion

        #region Test Get Completed Jobs
        [Test]
        public async Task GetCompletedJobs_WithAdmin1_ShouldReturnAllCompletedJobs()
        {
            ApiContext.Current.UserId = _adminId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Admin;
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                JobStatus = Model.Enums.System.JobStatus.Completed
            });
            var totalJob = _testJobs.Count(job => job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.JobStatus == Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            Assert.That(results.Count, Is.EqualTo(totalJob));
        }

        [Test]
        public async Task GetCompletedJobs_WithAcount1_ShouldReturnOnlyCompletedJobsForAccount1()
        {
            ApiContext.Current.UserId = _accountId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Account;
            var count = _testJobs.Count(job => job.AccountId == _accountId1
                && job.JobStatus == Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                JobStatus = Model.Enums.System.JobStatus.Completed
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetCompletedJobs_WithDesinger1_ShouldReturnOnlyCompletedJobsForDesinger1()
        {
            ApiContext.Current.UserId = _designerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Designer;
            var count = _testJobs.Count(job => job.DesignerId == _designerId1
                && job.JobStatus == Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                JobStatus = Model.Enums.System.JobStatus.Completed
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }

        [Test]
        public async Task GetCompletedJobs_WithCustomer1_ShouldReturnOnlyCompletedJobsForCustomer1()
        {
            ApiContext.Current.UserId = _customerId1;
            ApiContext.Current.Role = Model.Enums.System.RoleType.Customer;
            var count = _testJobs.Count(job => job.CustomerId == _customerId1
                && job.JobStatus == Model.Enums.System.JobStatus.Completed
                && job.CorrelationType == Model.Enums.System.CorrelationJobType.Job
                && job.ParentId == null);
            var results = await _jobRepository.GetAllJobs(new Model.Api.Request.Job.JobFilterRequest
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                JobStatus = Model.Enums.System.JobStatus.Completed
            });
            Assert.That(results.Count, Is.EqualTo(count));
        }
        #endregion
    }
}
