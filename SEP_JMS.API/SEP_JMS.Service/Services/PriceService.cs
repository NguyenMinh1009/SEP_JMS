using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Utils;
using SEP_JMS.Common;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Repository.Repositories;

namespace SEP_JMS.Service.Services
{
    public class PriceService : IPriceService
    {
        private readonly IPriceRepository priceRepository;

        private readonly IJobTypeService jobTypeService;
        public PriceService(IPriceRepository priceRepository, IJobTypeService jobTypeService)
        {
            this.priceRepository = priceRepository;
            this.jobTypeService = jobTypeService;
        }
        public async Task<PriceGroup?> GetGroup(Guid groupId)
        {
            return await priceRepository.GetPriceGroupById(groupId);
        }
        public async Task<PagingModel<PriceGroup>> GetPriceGroups(PriceGroupFilterRequestModel model)
        {
            return await priceRepository.GetPriceGroups(model);
        }
        public async Task<List<Price>> GetPrices(Guid groupId)
        {
            return await priceRepository.GetPriceByGroup(groupId);
        }
        public async Task<PriceGroup> AddPriceGroup(AddGroupPriceRequestModel model)
        {
            return await priceRepository.AddPriceGroup(model);
        }
        public async Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model)
        {
            return await priceRepository.UpdatePriceGroup(id, model);
        }
        public async Task<bool> UsedInCompany(Guid groupId)
        {
            return await priceRepository.UsedInCompany(groupId);
        }

        public async Task DeletePriceGroup(Guid groupId)
        {
            await priceRepository.DeletePriceGroup(groupId);
        }

        public async Task<string> ExportTemplate()
        {
            var folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ApiConstants.ExportFolder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            var filePath = Path.Combine(folderPath, $"{ApiContext.Current.Username}.{DateTime.Now:ddMMyyyy}_Price_Template.xlsx");
            var fileInfo = new FileInfo(filePath);
            if (fileInfo.Exists) fileInfo.Delete();
            using var package = new ExcelPackage(filePath);

            using var worksheet = package.Workbook.Worksheets.Add("Template for create new Group Price");
           // worksheet.Rows.Height = 60;
            worksheet.Columns.Width = 15;
            worksheet.Column(2).Width = 30;
            worksheet.Column(3).Width = 30;
            worksheet.Column(4).Width = 30;

            worksheet.Cells.Style.WrapText = true;
            worksheet.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            worksheet.Cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            worksheet.Column(1).Width = 4;
            worksheet.Column(2).Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            worksheet.Row(1).Height = 30;

            worksheet.Cells["A1"].Value = "Name";
            worksheet.Cells["A2"].Value = "Mô tả";
            worksheet.Cells["A4"].Value = "No.";
            worksheet.Cells["B4"].Value = "Loại thiết kế";
            worksheet.Cells["C4"].Value = "Mô tả";
            worksheet.Cells["D4"].Value = "Đơn giá";
            
            worksheet.Cells["A1:B1"].Style.Font.Bold = true;
            worksheet.Cells["A4:D4"].Style.Font.Bold = true;

            var index = 5;
            decimal mdw = worksheet.Workbook.MaxFontWidth;
            var sum = 0;

            var jobTypes = await jobTypeService.GetJobTypes();
            foreach (var jt in jobTypes)
            {
                
                    worksheet.Cells[$"A{index}"].Value = index - 4;
                    worksheet.Cells[$"B{index}"].Value = jt.TypeName;
                    worksheet.Cells[$"C{index}"].Value = string.Empty;
                    worksheet.Cells[$"D{index}"].Value = 0;
                    index++;
            }
            index++;
            package.Save();
            return filePath;
        }
    }
}
