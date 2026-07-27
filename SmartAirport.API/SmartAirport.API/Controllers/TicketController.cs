using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartAirport.API.DTOs;
using SmartAirport.API.Services;

namespace SmartAirport.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class TicketController : ControllerBase
{

    private readonly TicketService _service;


    public TicketController(
        TicketService service)
    {
        _service = service;
    }


    [HttpPost]
    public async Task<IActionResult> CreateTicket(
      CreateTicketRequest request)
    {
        try
        {
            var result = await _service.CreateTicket(request);

            return Accepted(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {

        var userId = User.FindFirst("sub")?.Value;

        var email = User.FindFirst("email")?.Value;

        var role = User.FindFirst(
            System.Security.Claims.ClaimTypes.Role
        )?.Value;


        return Ok(new
        {
            userId,
            email,
            role
        });
    }
    [HttpPut("cancel")]
    public async Task<IActionResult> CancelTicket(
        CancelTicketRequest request)
    {
        var result = await _service.CancelTicket(
            request.FlightCode
        );


        if (result == null)
        {
            return NotFound(new
            {
                message = "Waiting ticket not found."
            });
        }


        return Ok(result);
    }
}