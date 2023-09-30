using AutoMapper;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SEP_JMS.Common;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Api.Response.Job;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.Service.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository jobRepository;
        private readonly IUserRepository userRepository;
        private readonly IPriceRepository priceRepository;
        private readonly IPriceGroupRepository priceGroupRepository;
        private readonly ITypeOfJobRepository typeOfJobRepository;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public JobService(IJobRepository jobRepository,
            IUserRepository userRepository,
            IPriceRepository priceRepository,
            IPriceGroupRepository priceGroupRepository,
            ITypeOfJobRepository typeOfJobRepository,

            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobRepository = jobRepository;
            this.userRepository = userRepository;
            this.priceGroupRepository = priceGroupRepository;
            this.priceRepository = priceRepository;
            this.typeOfJobRepository = typeOfJobRepository;

            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<PagingModel<JobResponse>> GetAllJobs(JobFilterRequest model)
        {
            var jobsInfo = await jobRepository.GetAllJobs(model);
            var result = new List<JobResponse>();
            foreach (var jobInfo in jobsInfo.Items)
            {
                var jobDisplay = mapper.Map<JobResponse>(jobInfo.Item1);
                jobDisplay.CreatedBy = mapper.Map<UserResponse>(jobInfo.Item2);
                jobDisplay.Customer = mapper.Map<CustomerResponse>(jobInfo.Item3);
                jobDisplay.Account = mapper.Map<EmployeeResponse>(jobInfo.Item4);
                jobDisplay.Designer = mapper.Map<EmployeeResponse>(jobInfo.Item5);
                jobDisplay.Company = mapper.Map<CompanyResponse>(jobInfo.Item6);
                result.Add(jobDisplay);
            }
            return new PagingModel<JobResponse>
            {
                Items = result,
                Count = jobsInfo.Count
            };
        }

        public async Task<Guid?> CreateJob(CreateJobRequest model)
        {
            if (model.CorrelationType == CorrelationJobType.Project && model.ParentId != null) throw new ArgumentException("project can't have parent id");

            var account = await userRepository.Get(model.AccountId);
            if (account == null || account.RoleType != RoleType.Account) throw new Exception($"account {model.AccountId} not found");

            var customer = await userRepository.Get(model.CustomerId);
            if (customer == null || customer.RoleType != RoleType.Customer) throw new Exception($"customer {model.CustomerId} not found");

            if (model.DesignerId != null)
            {
                var designer = await userRepository.Get(model.DesignerId.Value);
                if (designer == null || customer.RoleType != RoleType.Designer) throw new Exception($"designer {model.DesignerId} not found");
            }

            var job = mapper.Map<Job>(model);
            var folderModel = new FolderItem();
            foreach (var file in model.RequirementFiles)
            {
                var fileModel = await FileUtility.SaveFile(ApiConstants.RequirementUploadFolder, job.JobId.ToString(), file);
                folderModel.Files.Add(fileModel);
            }

            job.Requirements = JsonConvert.SerializeObject(folderModel);
            var createdJob = await jobRepository.Add(job);
            return createdJob.JobId;
        }

        public async Task<Tuple<Job, User, User, User, User, Company, TypeOfJob>?> GetJob(Guid jobId)
        {
            return await jobRepository.GetJob(jobId);
        }

        public async Task<Job?> GetBasicJob(Guid jobId)
        {
            return await jobRepository.GetBasicJob(jobId);
        }

        public async Task<bool> UpdateDesignerJob(Guid jobId, UpdateJobDesignerRequest model)
        {
            var job = await jobRepository.UpdateDesignerJob(jobId, model);
            if (job == null) return false;
            return true;
        }

        public async Task<bool> UpdateJob(Guid jobId, UpdateJobRequest model)
        {
            var job = await jobRepository.UpdateJob(jobId, model);
            if (job == null) return false;
            return true;
        }

        public async Task UpdateFinalProductsToLocal(Guid jobId, FolderItem finalFolder)
        {
            await jobRepository.UpdateFinalProductsToLocal(jobId, finalFolder);
        }

        public async Task UpdatePreviewProductsToLocal(Guid jobId, FolderItem previewFolder)
        {
            await jobRepository.UpdatePreviewProductsToLocal(jobId, previewFolder);
        }

        public async Task UpdateRequirementProductsToLocal(Guid jobId, FolderItem requirementFolder)
        {
            await jobRepository.UpdateRequirementProductsToLocal(jobId, requirementFolder);
        }

        public async Task Delete(Guid jobId)
        {
            var job = await jobRepository.Get(jobId) ?? throw new NullReferenceException($"can't find job {jobId}");
            await jobRepository.Delete(job);
        }

        public async Task<string> ExportJobs(ExportJobRequest model)
        {
            var jobsAndCompany = await jobRepository.GetAllJobsForExport(model);
            var jobTypes = await typeOfJobRepository.GetAll(type => true, 0, int.MaxValue);

            if (!jobsAndCompany.Any()) return string.Empty;
            var jobGroups = jobsAndCompany.GroupBy(job => job.Item2.CompanyId);

            var folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ApiConstants.ExportFolder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            var filePath = Path.Combine(folderPath, $"{ApiContext.Current.Username}.{DateTime.Now:ddMMyyyy.HHmmssfff}.xlsx");
            var fileInfo = new FileInfo(filePath);
            if (fileInfo.Exists) fileInfo.Delete();
            using var package = new ExcelPackage(filePath);

            using var worksheet = package.Workbook.Worksheets.Add("Thống kê công việc hoàn thành");
            worksheet.Rows.Height = 60;
            worksheet.Columns.Width = 15;
            worksheet.Column(2).Width = 70;
            worksheet.Column(9).Width = 30;

            worksheet.Cells.Style.WrapText = true;
            worksheet.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            worksheet.Cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            worksheet.Column(1).Width = 4;
            worksheet.Column(2).Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            worksheet.Row(1).Height = 30;

            worksheet.Cells["A1"].Value = "STT";
            worksheet.Cells["B1"].Value = "Tên công việc";
            worksheet.Cells["C1"].Value = "Khách hàng";
            worksheet.Cells["D1"].Value = "Loại Job";
            worksheet.Cells["E1"].Value = "Loại thiết kế";
            worksheet.Cells["F1"].Value = "Số lượng";
            worksheet.Cells["G1"].Value = "Đơn giá";
            worksheet.Cells["H1"].Value = "Thành tiền";
            worksheet.Cells["I1"].Value = "Ảnh sản phẩm";
            worksheet.Cells["A1:I1"].Style.Font.Bold = true;

            var index = 2;
            decimal mdw = worksheet.Workbook.MaxFontWidth;
            var sum = 0;
            foreach (var group in jobGroups)
            {
                var prices = await priceRepository.GetAll((price) => price.PriceGroupId == group.First().Item2.PriceGroupId);
                foreach (var jobInfo in group)
                {
                    var jobType = jobTypes.FirstOrDefault(type => type.TypeId == jobInfo.Item1.JobType);
                    worksheet.Cells[$"A{index}"].Value = index - 1;
                    worksheet.Cells[$"B{index}"].Value = jobInfo.Item1.Title;
                    worksheet.Cells[$"C{index}"].Value = jobInfo.Item2.CompanyName;
                    worksheet.Cells[$"D{index}"].Value = jobInfo.Item1.CorrelationType == CorrelationJobType.Job ? ApiConstants.JobName : ApiConstants.ProjectName;
                    worksheet.Cells[$"E{index}"].Value = jobType?.TypeName ?? ApiConstants.UnkownJobType;
                    worksheet.Cells[$"F{index}"].Value = jobInfo.Item1.Quantity;

                    var price = prices.FirstOrDefault(p => p.JobTypeId == jobInfo.Item1.JobType);
                    var unitPrice = price == null ? 0 : price.UnitPrice;
                    worksheet.Cells[$"G{index}"].Value = unitPrice.ToString("N0");

                    var totalPrice = unitPrice * jobInfo.Item1.Quantity;
                    sum += totalPrice;
                    worksheet.Cells[$"H{index}"].Value = totalPrice.ToString("N0");

                    var folder = JsonConvert.DeserializeObject<FolderItem>(jobInfo.Item1.FinalPreview ?? string.Empty);
                    var file = folder?.Files?.FirstOrDefault();
                    if (file != null)
                    {
                        var imgFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ApiConstants.PreviewUploadFolder, jobInfo.Item1.JobId.ToString());
                        var imgfilePath = FileUtility.GetFilePath(imgFolderPath, file);
                        if (!string.IsNullOrEmpty(imgfilePath))
                        {
                            var fileData = File.Open(imgfilePath, FileMode.Open);
                            try
                            {
                                int pixelY = (int)(worksheet.Row(index).Height / 0.75);
                                int pixelX = (int)decimal.Truncate((256 * (decimal)worksheet.Column(9).Width + decimal.Truncate(128 / mdw)) / 256 * mdw);
                                var picture = worksheet.Drawings.AddPicture(file.FileName, fileData);
                                if (picture.Size.Width > pixelX || picture.Size.Height > pixelY)
                                {
                                    var percentX = (double)pixelX / picture.Size.Width;
                                    var percentY = (double)pixelY / picture.Size.Height;
                                    if (percentX < percentY) picture.SetSize((int)Math.Floor(picture.Size.Width * percentX), (int)Math.Floor(picture.Size.Height * percentX));
                                    else picture.SetSize((int)Math.Floor(picture.Size.Width * percentY), (int)Math.Floor(picture.Size.Height * percentY));
                                }
                                picture.SetPosition(index - 1, 0, 8, 0);
                            }
                            finally
                            {
                                fileData.Dispose();
                            }
                        }
                    }
                    index++;
                }
            }

            worksheet.Cells[$"A{index}:G{index}"].Merge = true;
            worksheet.Cells[$"A{index}"].Value = "TỔNG GIÁ TRỊ HỢP ĐỒNG TRƯỚC THUẾ GTGT";
            worksheet.Cells[$"A{index}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            worksheet.Cells[$"A{index}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[$"H{index}"].Value = sum.ToString("N0");
            worksheet.Row(index).Height = 30;
            index++;

            worksheet.Cells[$"A{index}:G{index}"].Merge = true;
            worksheet.Cells[$"A{index}"].Value = "VAT (10%)";
            worksheet.Cells[$"A{index}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            worksheet.Cells[$"A{index}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[$"H{index}"].Value = (sum / 10).ToString("N0");
            worksheet.Row(index).Height = 30;
            index++;

            worksheet.Cells[$"A{index}:G{index}"].Merge = true;
            worksheet.Cells[$"A{index}"].Value = "TỔNG GIÁ TRỊ HỢP ĐỒNG SAU THUẾ GTGT";
            worksheet.Cells[$"A{index}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            worksheet.Cells[$"A{index}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[$"A{index}"].Style.Font.Bold = true;
            worksheet.Cells[$"H{index}"].Value = (sum + sum / 10).ToString("N0");
            worksheet.Row(index).Height = 30;
            index++;
            package.Save();
            return filePath;
        }

        public async Task<List<JobStatisticsResponse>> GetJobStatistics(StatisticsJobRequest model)
        {
            var totalJobs = await jobRepository.GetJobStatistics(model, null);
            var totalFinishedJobs = await jobRepository.GetJobStatistics(model, JobStatus.Completed);
            var response = new List<JobStatisticsResponse>();
            foreach (var job in totalJobs)
            {
                var statistics = new JobStatisticsResponse
                {
                    CompanyName = job.Item1.CompanyName,
                    TotalJobs = job.Item3,
                    ExpectedProfit = job.Item2
                };
                var finishedJob = totalFinishedJobs.FirstOrDefault(fjob => fjob.Item1.CompanyId == job.Item1.CompanyId);
                if (finishedJob != null)
                {
                    statistics.TotalFinishedJobs = finishedJob.Item3;
                    statistics.TotalProfit = finishedJob.Item2;
                }
                response.Add(statistics);
            }
            return response;
        }
    }
}
