using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartAirport.API.Data;
using SmartAirport.API.Services;
using SmartAirport.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
DotNetEnv.Env.Load();

builder.Configuration["Jwt:Key"] =
    Environment.GetEnvironmentVariable("JWT_KEY")
    ?? builder.Configuration["Jwt:Key"];

builder.Configuration["AzureServiceBus:ConnectionString"] =
    Environment.GetEnvironmentVariable("AZURE_SERVICE_BUS_CONNECTION_STRING")
    ?? builder.Configuration["AzureServiceBus:ConnectionString"];
// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


// Database
builder.Services.AddDbContext<AirportDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("AirportConnection")));

// Dependency Injection
builder.Services.AddSingleton<DbConnectionFactory>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<TicketService>();
builder.Services.AddSingleton<ServiceBusPublisher>();

builder.Services.AddSwaggerGen();


builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],

        ValidAudience = builder.Configuration["Jwt:Audience"],

        RoleClaimType = ClaimTypes.Role,

        IssuerSigningKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!
                ))
    };
});
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/test-db", async (AirportDbContext db) =>
{
    var count = await db.QueueTickets.CountAsync();

    return Results.Ok(new
    {
        Tickets = count
    });
});

app.Run();
