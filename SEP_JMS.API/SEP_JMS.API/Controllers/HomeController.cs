using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.Home;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.API.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly string logPrefix = "[AdminController]";

        private readonly ICompanyService companyService;
        private readonly IUserService userService;
        private readonly IJobService jobService;

        private readonly IJMSLogger logger;

        public HomeController(ICompanyService companyService,
            IUserService userService,
            IJobService priceService,

            IJMSLogger logger)
        {
            this.companyService = companyService;
            this.userService = userService;
            this.jobService = priceService;

            this.logger = logger;
        }

        [HttpGet("infocount")]
        public async Task<ActionResult<BasicInfoCountResponse>> GetBasicInfoCount()
        {
            try
            {
                logger.Info($"{logPrefix} Start to get basic info count.");
                var totalCompany = await companyService.GetTotalComapy();
                var totalJob = await jobService.GetTotalJob();
                var totalProject = await jobService.GetTotalProject();
                var totalDesigner = await userService.CountUserByRole(Model.Enums.System.RoleType.Designer);
                var totalCustomer = await userService.CountUserByRole(Model.Enums.System.RoleType.Customer);
                return new BasicInfoCountResponse
                {
                    TotalCompany = totalCompany,
                    TotalCustomer = totalCustomer,
                    TotalDesigner = totalDesigner,
                    TotalJob = totalJob,
                    TotalProject = totalProject,
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting basic info count. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
