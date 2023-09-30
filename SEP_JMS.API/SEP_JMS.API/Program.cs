using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OfficeOpenXml;
using SEP_JMS.API.Extensions;
using SEP_JMS.Common.Constants;
using SEP_JMS.Model.Enums.System;
using Serilog;
using System.Net.Mime;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(policy =>
{
    policy.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JwtKey") ?? throw new Exception("Empty JWT Key"))),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtIssuer"],
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(PolicyConstants.CreateJob, policy =>
    {
        policy.RequireRole(RoleType.Admin.ToString(), RoleType.Account.ToString(), RoleType.Customer.ToString());
    });
    options.AddPolicy(PolicyConstants.Internal, policy =>
    {
        policy.RequireRole(RoleType.Admin.ToString(), RoleType.Account.ToString(), RoleType.Designer.ToString());
    });
    options.AddPolicy(PolicyConstants.Assign, policy =>
    {
        policy.RequireRole(RoleType.Admin.ToString(), RoleType.Account.ToString());
    });
    options.AddPolicy(PolicyConstants.AccountAndDesigner, policy =>
    {
        policy.RequireRole(RoleType.Designer.ToString(), RoleType.Account.ToString());
    });
});

builder.Services
.AddBootstrap(builder.Configuration)
.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var result = new BadRequestObjectResult(actionContext.ModelState);
        result.ContentTypes.Add(MediaTypeNames.Application.Json);
        result.Value = "Invalid Request";
        return result;
    };
})
.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "AlwayX.API", Version = "v1" });
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme.",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    options.AddSecurityDefinition("Bearer", securityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
            { securityScheme, new[] { "Bearer" } }
    });
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseApiContext();
app.Run();