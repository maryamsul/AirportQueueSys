using Microsoft.AspNetCore.Mvc;
using SmartAirport.API.DTOs;
using SmartAirport.API.Services;

namespace SmartAirport.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.Login(request);
        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password"
            });
        }
        return Ok(result);
    }

}