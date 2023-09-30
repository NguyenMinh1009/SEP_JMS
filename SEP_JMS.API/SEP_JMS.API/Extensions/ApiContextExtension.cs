using SEP_JMS.Common;
using SEP_JMS.Model.Enums.System;
using System.Security.Claims;

namespace SEP_JMS.API.Extensions
{
    public static class ApiContextExtension
    {
        public static IApplicationBuilder UseApiContext(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                ApiContext.Empty();
                if (context.User.Claims.Any())
                {
                    var correlationId = context.Request.Headers["traceparent"].ToString();
                    ApiContext currentContext = new()
                    {
                        Role = (RoleType)Enum.Parse(typeof(RoleType), context.User.FindFirstValue(ClaimTypes.Role)),
                        UserId = Guid.Parse(context.User.FindFirstValue(ClaimTypes.NameIdentifier)),
                        CorrelationId = string.IsNullOrEmpty(correlationId) ? Guid.NewGuid().ToString() : correlationId,
                        Username = context.User.FindFirstValue(ClaimTypes.Name),
                        Email = context.User.FindFirst(ClaimTypes.Email)?.Value
                    };
                    ApiContext.Current = currentContext;
                }
                await next();
            });
            return app;
        }
    }
}
