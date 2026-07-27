using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartAirportQueue.Models;

public class JwtService
{
    private readonly IConfiguration _configuration;


    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }


    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                user.UserId.ToString()
            ),

            new Claim(
                JwtRegisteredClaimNames.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            ),

            new Claim(
                ClaimTypes.Name,
                user.FullName
            )
        };


        return CreateToken(claims);
    }



    public string GenerateStaffContextToken(
     User user,
     string serviceType,
     int counterId)
    {
        var claims = new[]
        {
        new Claim(
            JwtRegisteredClaimNames.Sub,
            user.UserId.ToString()
        ),

        new Claim(
            JwtRegisteredClaimNames.Email,
            user.Email
        ),

        new Claim(
            ClaimTypes.Role,
            user.Role
        ),

        new Claim(
            ClaimTypes.Name,
            user.FullName
        ),

        new Claim(
            "ServiceType",
            serviceType
        ),

        new Claim(
            "CounterId",
            counterId.ToString()
        )
    };


        return CreateToken(claims);
    }


    private string CreateToken(IEnumerable<Claim> claims)
    {

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!
            )
        );


        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


        var token = new JwtSecurityToken(

            issuer:
            _configuration["Jwt:Issuer"],


            audience:
            _configuration["Jwt:Audience"],


            claims: claims,


            expires:
            DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(
                    _configuration["Jwt:DurationInMinutes"]
                )
            ),


            signingCredentials:
            credentials
        );


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}