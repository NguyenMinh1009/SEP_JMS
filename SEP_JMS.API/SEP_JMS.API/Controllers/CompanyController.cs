using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.API.Controllers
{
    [Route("api/compay")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly string logPrefix = "[CompanyController]";

        private readonly IJobService jobService;
        private readonly ICompanyService companyService;
        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public CompanyController(IJobService jobService,
            ICompanyService companyService,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobService = jobService;
            this.companyService = companyService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [Authorize(Policy = PolicyConstants.Assign)]
        [HttpPost("search")]
        public async Task<ActionResult<PagingModel<CompanyResponse>>> FindCompany(CompanyFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all companies.");
                var companies = await companyService.GetCompanies(model);
                return new PagingModel<CompanyResponse>
                {
                    Count = companies.Count,
                    Items = mapper.Map<List<CompanyResponse>>(companies.Items)
                };
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when getting all companies. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}