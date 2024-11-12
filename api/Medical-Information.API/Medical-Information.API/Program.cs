using Medical_Information.API.Data;
using Medical_Information.API.Mappings;
using Medical_Information.API.Repositories.Interfaces;
using Medical_Information.API.Repositories.Interfaces.Auth;
using Medical_Information.API.Repositories.SQLImplementation;
using Medical_Information.API.Repositories.SQLImplementation.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "MIS API", Version = "v1" });
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = "Oauth2",
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<MedicalInformationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationConnectionString")));

builder.Services.AddDbContext<MedicalInformationAuthDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationAuthConnectionString")));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "All Origins",
                      policy =>
                      {
                          policy.WithOrigins("*");
                          policy.WithHeaders("*");
                          policy.WithMethods("*");
                      });
});

builder.Services.AddScoped<IAdminRepository, SQLAdminRepository>();
builder.Services.AddScoped<IStudentRepository, SQLStudentRepository>();
builder.Services.AddScoped<IAdminQCLotRepository, SQLAdminQCLotRepository>();
builder.Services.AddScoped<IAnalyteRepository, SQLAnalyteRepository>();
builder.Services.AddScoped<IBloodBankQCLotRepository, SQLBloodBankQCLotRepository>();
builder.Services.AddScoped<IReagentRepository, SQLReagentRepository>();
builder.Services.AddScoped<IBBStudentReportRepository, SQLBBStudentReportRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("MedicalInformationSimulation")
    .AddEntityFrameworkStores<MedicalInformationAuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("All Origins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
