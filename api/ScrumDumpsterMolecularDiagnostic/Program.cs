using ScrumDumpsterMolecularDiagnostic.Data;
using ScrumDumpsterMolecularDiagnostic.Mappings;
using ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces;
using ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces.Auth;
using ScrumDumpsterMolecularDiagnostic.Repositories.LocalImplementation;
using ScrumDumpsterMolecularDiagnostic.Repositories.SQLImplementation;
using ScrumDumpsterMolecularDiagnostic.Repositories.SQLImplementation.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
//dotnet new webapi -n ScrumDumpsterMolecularDiagnostic
// Add controllers for handling API requests
builder.Services.AddControllers();

// Adds HttpContextAccessor for accessing HTTP context in other services
builder.Services.AddHttpContextAccessor();

// Adds Swagger for API documentation and testing
builder.Services.AddEndpointsApiExplorer(); //Enables minimal API endpoint discovery for Swagger.
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "MIS API", Version = "v1" });

    // Adds JWT-based security definition for Swagger
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    // Adds JWT security requirements to Swagger documentation
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

// Configure the primary database context for application data
builder.Services.AddDbContext<MedicalInformationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationConnectionString")));

// Configure a secondary database context for authentication data
builder.Services.AddDbContext<MedicalInformationAuthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MedicalInformationAuthConnectionString")));

// Configure CORS policy to only allow requests from the React client running on http://localhost:5173
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // Allowed client origin
                                .AllowAnyHeader() // Allow all headers
                                .AllowAnyMethod(); // Allow all HTTP methods (GET, POST, etc.)
                      });
});

// Dependency Injection (DI) for application repositories and services
builder.Services.AddScoped<IAdminRepository, SQLAdminRepository>();
builder.Services.AddScoped<IStudentRepository, SQLStudentRepository>();
builder.Services.AddScoped<IAdminQCLotRepository, SQLAdminQCLotRepository>();
builder.Services.AddScoped<IAnalyteRepository, SQLAnalyteRepository>();
builder.Services.AddScoped<IImageRepository, LocalImageRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>(); // Token repository for managing JWT tokens

// Configure AutoMapper for mapping between entities and DTOs
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

// Configure ASP.NET Identity for authentication and authorization
builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>() // Role-based authorization
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("MedicalInformationSimulation")
    .AddEntityFrameworkStores<MedicalInformationAuthDbContext>() // Store user data in Auth database
    .AddDefaultTokenProviders();

// Configure Identity password policy
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true; // Require at least one digit in password
    options.Password.RequireLowercase = true; // Require at least one lowercase letter
    options.Password.RequireUppercase = true; // Require at least one uppercase letter
    options.Password.RequireNonAlphanumeric = false; // Non-alphanumeric not required
    options.Password.RequiredLength = 8; // Minimum password length
    options.Password.RequiredUniqueChars = 1; // At least one unique character
});

// Configure JWT authentication with validation parameters
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Ensure token issuer matches expected issuer
            ValidateAudience = true, // Ensure token audience matches expected audience
            ValidateLifetime = true, // Ensure token has not expired
            ValidateIssuerSigningKey = true, // Ensure token is signed with the correct key
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Expected token issuer
            ValidAudience = builder.Configuration["Jwt:Audience"], // Expected token audience
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Secret key for token signing
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Enable Swagger in development for API testing and documentation
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Enforces HTTPS for all requests

app.UseCors("AllowSpecificOrigin"); // Apply the defined CORS policy

app.UseAuthentication(); // Enables authentication middleware
app.UseAuthorization(); // Enables authorization middleware

// Serve static files (e.g., images) from the "Images" folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});

// Map incoming requests to controllers
app.MapControllers();

app.Run(); // Run the application
