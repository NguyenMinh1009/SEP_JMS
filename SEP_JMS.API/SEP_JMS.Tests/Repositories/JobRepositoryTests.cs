using SEP_JMS.Model.Models;
using SEP_JMS.Repository.Repositories;

namespace SEP_JMS.Tests.Repositories
{
    [TestFixture]
    public class JobRepositoryTests
    {
        private readonly JobRepository _jobRepository;

        public JobRepositoryTests()
        {
            _jobRepository = ContextGenerator.GetRepository<JobRepository, Job>();
        }

        [SetUp]
        public void Setup()
        {

        }
    }
}
