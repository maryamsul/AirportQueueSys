using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAirport.API.Data;
using SmartAirport.API.DTOs;
using SmartAirport.API.Models;
using static SmartAirport.API.Models.QueueTicket;

namespace SmartAirport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StaffController : ControllerBase
{
    private readonly AirportDbContext _context;
    private readonly JwtService _jwtService;

    public StaffController(AirportDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    // ============================
    // SELECT SERVICE
    // ============================

    [Authorize(Roles = "Staff")]
    [HttpPost("select-service")]
    public async Task<IActionResult> SelectService([FromBody] SelectServiceRequest request)
    {
        var userIdClaim = User.FindFirst("sub")?.Value;

        if (userIdClaim == null)
            return Unauthorized("User id missing.");

        int userId = int.Parse(userIdClaim);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            return NotFound("User not found.");

        var token = _jwtService.GenerateStaffContextToken(
            user,
            request.ServiceType,
            request.CounterId);

        return Ok(new
        {
            token,
            user = user.FullName,
            serviceType = request.ServiceType,
            counterId = request.CounterId
        });
    }

    // ============================
    // GET QUEUE
    // ============================

    [Authorize(Roles = "Staff")]
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue()
    {
        var serviceType = User.FindFirst("ServiceType")?.Value;

        if (string.IsNullOrEmpty(serviceType))
            return Unauthorized("Service context missing.");

        var tickets = await _context.QueueTickets
            .Where(t =>
                t.ServiceType == serviceType &&
                (t.Status == QueueTicket.TicketStatus.Waiting ||
                 t.Status == QueueTicket.TicketStatus.Served))
            .OrderBy(t => t.CreatedAt)
            .Select(t => new
            {
                t.TicketId,
                t.QueueNumber,
                Status = t.Status.ToString(),
                t.CreatedAt,
                t.CounterId
            })
            .ToListAsync();

        return Ok(tickets);
    }

    // ============================
    // CALL NEXT PASSENGER
    // ============================

    [Authorize(Roles = "Staff")]
    [HttpPut("next")]
    public async Task<IActionResult> NextPassenger()
    {
        var serviceType = User.FindFirst("ServiceType")?.Value;
        var counterIdClaim = User.FindFirst("CounterId")?.Value;

        if (string.IsNullOrEmpty(serviceType) || string.IsNullOrEmpty(counterIdClaim))
            return Unauthorized("Staff context missing.");

        int counterId = int.Parse(counterIdClaim);

        var ticket = await _context.QueueTickets
            .Where(t =>
                t.ServiceType == serviceType &&
                t.Status == QueueTicket.TicketStatus.Waiting)
            .OrderBy(t => t.CreatedAt)
            .FirstOrDefaultAsync();

        if (ticket == null)
            return NotFound("No waiting passengers.");

        ticket.Status = QueueTicket.TicketStatus.Served;
        ticket.CounterId = counterId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Passenger called successfully",
            ticketId = ticket.TicketId,
            queueNumber = ticket.QueueNumber,
            counterId = ticket.CounterId,
            status = ticket.Status.ToString()
        });
    }

    // ============================
    // COMPLETE PASSENGER
    // ============================

    [Authorize(Roles = "Staff")]
    [HttpPut("complete/{ticketId}")]
    public async Task<IActionResult> Complete(int ticketId)
    {
        var serviceType = User.FindFirst("ServiceType")?.Value;

        if (string.IsNullOrEmpty(serviceType))
            return Unauthorized("Service context missing.");

        var ticket = await _context.QueueTickets
            .FirstOrDefaultAsync(t =>
                t.TicketId == ticketId &&
                t.ServiceType == serviceType);

        if (ticket == null)
            return NotFound("Ticket not found.");

        if (ticket.Status != QueueTicket.TicketStatus.Served)
            return BadRequest("Passenger is not currently being served.");

        ticket.Status = QueueTicket.TicketStatus.Completed;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Passenger service completed",
            ticketId = ticket.TicketId,
            queueNumber = ticket.QueueNumber,
            status = ticket.Status.ToString()
        });
    }

    // ============================
    // CANCEL TICKET
    // ============================

    [Authorize(Roles = "Staff")]
    [HttpPut("cancel/{ticketId}")]
    public async Task<IActionResult> Cancel(int ticketId)
    {
        var ticket = await _context.QueueTickets.FindAsync(ticketId);

        if (ticket == null)
            return NotFound("Ticket not found.");

        ticket.Status = QueueTicket.TicketStatus.Cancelled;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Ticket cancelled successfully",
            ticketId = ticket.TicketId,
            status = ticket.Status.ToString()
        });
    }
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var serviceType = User.FindFirst("ServiceType")?.Value;

        if (serviceType == null)
            return Unauthorized();


        var stats = new QueueStatsDto
        {
            Waiting = await _context.QueueTickets
                .CountAsync(q =>
                    q.ServiceType == serviceType &&
                    q.Status == TicketStatus.Waiting),

            Served = await _context.QueueTickets
                .CountAsync(q =>
                    q.ServiceType == serviceType &&
                    q.Status == TicketStatus.Served),

            Completed = await _context.QueueTickets
                .CountAsync(q =>
                    q.ServiceType == serviceType &&
                    q.Status == TicketStatus.Completed),

            Cancelled = await _context.QueueTickets
                .CountAsync(q =>
                    q.ServiceType == serviceType &&
                    q.Status == TicketStatus.Cancelled)
        };


        return Ok(stats);
    }
}