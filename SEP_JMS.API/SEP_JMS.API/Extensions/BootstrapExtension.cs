using Microsoft.EntityFrameworkCore;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Repository.Repositories;
using SEP_JMS.Service.IServices;
using SEP_JMS.Service.Services;
using System.Reflection;

namespace SEP_JMS.API.Extensions
{
    public static class BootstrapExtension
    {
        public static IServiceCollection AddBootstrap(this IServiceCollection services, IConfiguration configuration)
        {
            return services.AddDbContext<JSMContext>(options => options
                .UseSqlServer(configuration["DBConnectionString"]))

                .AddScoped<ICompanyRepository, CompanyRepository>()
                .AddScoped<IJobRepository, JobRepository>()
                .AddScoped<IJobTypeRepository, JobTypeRepository>()
                .AddScoped<IPriceGroupRepository, PriceGroupRepository>()
                .AddScoped<IPriceRepository, PriceRepository>()
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<ICommentRepository, CommentRepository>()

                .AddScoped<ICompanyService, CompanyService>()
                .AddScoped<IJobService, JobService>()
                .AddScoped<IUserService, UserService>()
                .AddScoped<IJobTypeService, JobTypeService>()
                .AddScoped<INotificationRepository, NotificationRepository>()
                .AddScoped<INotificationService, NotificationService>()
                .AddScoped<ICommentService, CommentService>()

                .AddSingleton<IJMSLogger, JMSLogger>()
                .AddAutoMapper(Assembly.Load("SEP_JMS.Mapper"));
        }
    }
}
