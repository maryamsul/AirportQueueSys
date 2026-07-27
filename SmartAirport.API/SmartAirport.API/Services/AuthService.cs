using Microsoft.Data.SqlClient;
using SmartAirport.API.Data;
using SmartAirport.API.DTOs;
using SmartAirport.API.Services;
using SmartAirportQueue.Models;

using Microsoft.EntityFrameworkCore;


public class AuthService : IAuthService //Any authentication service must have a Login method
{
    private readonly AirportDbContext _db;
    private readonly JwtService _jwtService;
    public AuthService(AirportDbContext db, JwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }
    public async Task<LoginResponse?> Login(LoginRequest request)  //will return Task<LoginResponse?>  means LOgin Request or null
        //because ? means nullable
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == request.Email); //EF translates it into SQL: SELECT* FROM Users
      //EF generates: SELECT TOP 1 * FROM Users WHERE Email = 'staff@airport.com'
        if (user == null)
            return null;

        if (request.Password != user.PasswordHash)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user); //per user

        return new LoginResponse
        {
            Token = token,
            UserId = user.UserId,
            Role = user.Role,
            FullName = user.FullName
        };
    }
}/*
  * using System.Data;  old ADO.NET approach just for commands sqlcommand
public class AuthService : IAuthService
{
    private readonly JwtService _jwtService;
    private readonly DbConnectionFactory _factory;
    public AuthService(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        using var connection = _factory.CreateConnection();
        await connection.OpenAsync();
        var token = _jwtService.GenerateToken(user);

        using var command = new SqlCommand( "GetUserByEmail", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@Email", request.Email );
        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            var user = new LoginResponse
            {
                UserId = Convert.ToInt32(reader["UserId"]),
                FullName = reader["FullName"].ToString()!,
                Role = reader["Role"].ToString()!,
                Token = reader["token"].ToString()!,
            };
            return user;

        }
        return null;
    }
}
*/