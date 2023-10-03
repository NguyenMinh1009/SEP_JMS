using Microsoft.EntityFrameworkCore;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Repository.Repositories;
using System.Reflection;

namespace SEP_JMS.API.Extensions
{
    public static class BootstrapExtension
    {
        public static IServiceCollection AddBootstrap(this IServiceCollection services, IConfiguration configuration)
        {
            return services.AddDbContext<JSMContext>(options => options
                .UseSqlServer(configuration["DBConnectionString"]))

                .AddScoped<IJobRepository, JobRepository>()
                .AddScoped<INotificationRepository, NotificationRepository>()

                .AddSingleton<IJMSLogger, JMSLogger>()
                .AddAutoMapper(Assembly.Load("SEP_JMS.Mapper"));
        }
    }
}
