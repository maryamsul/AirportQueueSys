using SmartAirport.API.DTOs;

namespace SmartAirport.API.Services;


public interface IAuthService
{
    Task<LoginResponse?> Login(LoginRequest request);
}