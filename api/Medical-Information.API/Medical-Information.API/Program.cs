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

// Configure database contexts
builder.Services.AddDbContext<MedicalInformationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationConnectionString")));

builder.Services.AddDbContext<MedicalInformationAuthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationAuthConnectionString")));

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "All Origins", policy =>
    {
        policy.WithOrigins("*")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add repository services
builder.Services.AddScoped<IAdminRepository, SQLAdminRepository>();
builder.Services.AddScoped<IStudentRepository, SQLStudentRepository>();
builder.Services.AddScoped<IAdminQCLotRepository, SQLAdminQCLotRepository>();
builder.Services.AddScoped<IAnalyteRepository, SQLAnalyteRepository>();
builder.Services.AddScoped<IBloodBankQCLotRepository, SQLBloodBankQCLotRepository>();
builder.Services.AddScoped<IReagentRepository, SQLReagentRepository>();
builder.Services.AddScoped<IBBStudentReportRepository, SQLBBStudentReportRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IReagentInputRepository, SQLReagentInputRepository>();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

// Configure Identity for authentication and authorization
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

// Configure JWT authentication
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
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MedicalInformationDbContext>();
    var authdbContext = scope.ServiceProvider.GetRequiredService<MedicalInformationAuthDbContext>();
    authdbContext.Database.Migrate();
    dbContext.Database.Migrate();  // This applies any pending migrations at startup
}

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("All Origins");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();
