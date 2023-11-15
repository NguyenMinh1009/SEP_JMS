using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using System.Data;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using Microsoft.AspNetCore.StaticFiles;
using SEP_JMS.Common.Utils;
using SEP_JMS.Service.Services;
using OfficeOpenXml;

namespace SEP_JMS.API.Controllers
{
    [Route("api/price")]
    [ApiController]
    [Authorize(Roles = PolicyConstants.Admin)]
    public class PriceController : ControllerBase
    {
        private readonly string logPrefix = "[PriceController]";
        private readonly IPriceService priceService;
        private readonly IJobTypeService jobTypeService;
        private readonly IJMSLogger logger;

        public PriceController(IPriceService priceService, IJobTypeService jobTypeService, IJMSLogger logger)
        {
            this.priceService = priceService;
            this.jobTypeService = jobTypeService;
            this.logger = logger;
        }
        [HttpPost("all")]
        public async Task<ActionResult<PagingModel<PriceGroup>>> GetPriceGroups(PriceGroupFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get price groups.");
                var priceGroups = await priceService.GetPriceGroups(model);
                return priceGroups;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting price groups. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpGet("group/{id}")]
        public async Task<ActionResult<PriceListDisplayModel>> GetPrices([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get prices of group {id}.");
                var priceGroup = await priceService.GetGroup(id);
                if (priceGroup == null) return NotFound();
                var prices = await priceService.GetPrices(id);
                return new PriceListDisplayModel
                {
                    Group = priceGroup,
                    Prices = prices.OrderBy(p => p.JobTypeId).ToList()
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting prices of group {id}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("group")]
        public async Task<ActionResult<PriceGroup>> CreateGroup(AddGroupPriceRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to create price group {model.Name}.");
                var gr = await priceService.AddPriceGroup(model);
                return gr;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when create price group {model.Name}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPut("group/{id}")]
        public async Task<ActionResult<PriceGroup>> UpdateGroup([FromRoute] Guid id, [FromBody] UpdatePriceGroupRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update price group {id}.");
                var gr = await priceService.UpdatePriceGroup(id, model);
                return gr;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when create price group {id}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpDelete("group/{id}")]
        public async Task<IActionResult> DeletePriceGroup([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to delete price group {id}.");
                var used = await priceService.UsedInCompany(id);
                if (used) return Conflict();

                await priceService.DeletePriceGroup(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when deleting price group {id}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpPost("export_template")]
        public async Task<IActionResult> ExportTemplate()
        {
            var filePath = string.Empty;
            try
            {
                logger.Info($"{logPrefix} Start to export template.");
                filePath = await priceService.ExportTemplate();
                if (string.IsNullOrEmpty(filePath)) return BadRequest();
                _ = new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string? mediaType);
                return new FileStreamResult(new FileStream(filePath, FileMode.Open), mediaType ?? "application/octet-stream");
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when exporting template. Error: {ex}");
                return StatusCode(500);
            }
            finally
            {
                try
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch { }
            }
        }

        [HttpPost("import_template_file")]
        public async Task<IActionResult> ImportTemplateFile(IFormFile file)
        {
            var filePath = string.Empty;
            try
            {
                logger.Info($"{logPrefix} Start to import template.");
                if (file == null || file.Length == 0 || file.Length > PolicyConstants.maxFileSizeDrive)
                {
                    throw new Exception("Invalid file!");
                }
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream).ConfigureAwait(false);

                    using (var package = new ExcelPackage(memoryStream))
                    {
                        var worksheet = package.Workbook.Worksheets[0];
                        // parse worksheet
                        var result = new PriceListDisplayModel();
                        result.Group = new PriceGroup();
                        result.Prices = new List<Price>();

                        result.Group.Name = worksheet.Cells["B1"].Value.ToString() ?? "";
                        result.Group.Description = worksheet.Cells["B2"].Value.ToString() ?? "";

                        var index = 5;
                        var jtAll = await jobTypeService.GetJobTypes();
                        for (var i = 0; i < jtAll.Count; i++)
                        {
                            var tName = worksheet.Cells[$"B{index}"].Value.ToString();
                            if (!String.IsNullOrEmpty(tName) )
                            {
                                var jobType = jtAll.Where(e => e.TypeName.Equals(tName, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                                if (jobType != null )
                                {
                                    result.Prices.Add(new Price()
                                    {
                                        JobTypeId = jobType.TypeId,
                                        Description = worksheet.Cells[$"C{index}"].Value.ToString(),
                                        UnitPrice = Convert.ToInt32(worksheet.Cells[$"D{index}"].Value)
                                    }) ;
                                }
                                
                            }
                            index++;
                        }

                        return Ok(result);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when importing template. Error: {ex}");
                return StatusCode(500);
            }
            finally
            {
                
            }
        }
    }
}
