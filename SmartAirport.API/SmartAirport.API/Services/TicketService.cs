using Microsoft.EntityFrameworkCore;
using SmartAirport.API.Data;
using SmartAirport.API.DTOs;
using SmartAirport.API.Events;
using SmartAirport.API.Models;

namespace SmartAirport.API.Services;

public class TicketService
{
    private readonly AirportDbContext _db;

    private readonly ServiceBusPublisher _publisher;
    public TicketService(
      AirportDbContext context,
      ServiceBusPublisher publisher)
    {
        _db = context;
        _publisher = publisher;
    }


    public async Task<TicketResponse> CreateTicket(CreateTicketRequest request)
    {

        // Check flight exists
        var flight = await _db.Flights
            .FirstOrDefaultAsync(x =>
                x.FlightNumber == request.FlightNumber);


        if (flight == null)
        {
            throw new Exception("Flight not found");
        }


        // Generate queue number

        var count = await _db.QueueTickets
            .CountAsync(x =>
                x.ServiceType == request.ServiceType);
        

        string prefix =
            request.ServiceType == "Check-in" ? "C" :
            request.ServiceType == "Security" ? "S" :
            "B";


        string queueNumber = prefix + (count + 1);



        // Create queue ticket

        var ticket = new QueueTicket
        {
            QueueNumber = queueNumber,

            ServiceType = request.ServiceType,

            Status = QueueTicket.TicketStatus.Waiting,

            CreatedAt = DateTime.UtcNow
        };


        _db.QueueTickets.Add(ticket);


        await _db.SaveChangesAsync();
        await _publisher.PublishAsync(
    new TicketCreatedEvent
    {
        TicketId = ticket.TicketId,
        QueueNumber = ticket.QueueNumber,
        ServiceType = ticket.ServiceType,
        FlightNumber = ticket.FlightNumber
    });


        return new TicketResponse
        {
            TicketNumber = ticket.QueueNumber,

            ServiceType = ticket.ServiceType,

            Status = ticket.Status.ToString(),

            EstimatedTime = count * 5
        };
    }
}