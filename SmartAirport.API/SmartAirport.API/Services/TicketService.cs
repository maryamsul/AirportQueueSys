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

        // ======================================
        // 1. Check if flight exists
        // ======================================

        var flight = await _db.Flights
            .FirstOrDefaultAsync(x =>
                x.FlightNumber == request.FlightNumber &&
                x.FlightCode == request.FlightCode);


        if (flight == null)
        {
            throw new Exception("Flight booking not found.");
        }



        // ======================================
        // 2. Check existing active ticket
        // ======================================

        var existingTicket = await _db.QueueTickets
            .FirstOrDefaultAsync(t =>
                t.FlightCode == request.FlightCode &&
                t.Status == QueueTicket.TicketStatus.Waiting);


        if (existingTicket != null)
        {
            throw new Exception(
                "Passenger already has an active waiting ticket."
            );
        }



        // ======================================
        // 3. Generate queue number
        // ======================================

        var count = await _db.QueueTickets
            .CountAsync(x =>
                x.ServiceType == request.ServiceType);


        string prefix =
            request.ServiceType == "Check-in" ? "C" :
            request.ServiceType == "Security" ? "S" :
            "B";


        string queueNumber = prefix + (count + 1);



        // ======================================
        // 4. Create Queue Ticket
        // ======================================

        var ticket = new QueueTicket
        {
            QueueNumber = queueNumber,

            ServiceType = request.ServiceType,

            Status = QueueTicket.TicketStatus.Waiting,

            CreatedAt = DateTime.UtcNow,

            FlightCode = request.FlightCode,

            FlightNumber = request.FlightNumber
        };


        _db.QueueTickets.Add(ticket);


        await _db.SaveChangesAsync();



        // ======================================
        // 5. Publish event to Azure Service Bus
        // ======================================

        await _publisher.PublishAsync(
            new TicketCreatedEvent
            {
                TicketId = ticket.TicketId,

                QueueNumber = ticket.QueueNumber,

                ServiceType = ticket.ServiceType,

                FlightNumber = ticket.FlightNumber
            });



        // ======================================
        // 6. Return passenger response
        // ======================================

        return new TicketResponse
        {
            TicketNumber = ticket.QueueNumber,

            ServiceType = ticket.ServiceType,

            Status = ticket.Status.ToString(),

            EstimatedTime = count * 5
        };
    }
    public async Task<TicketResponse?> CancelTicket(string flightCode)
    {
        var ticket = await _db.QueueTickets
            .FirstOrDefaultAsync(t =>
                t.FlightCode == flightCode &&
                t.Status == QueueTicket.TicketStatus.Waiting);


        if (ticket == null)
        {
            return null;
        }


        ticket.Status = QueueTicket.TicketStatus.Cancelled;


        await _db.SaveChangesAsync();


        return new TicketResponse
        {
            TicketNumber = ticket.QueueNumber,

            ServiceType = ticket.ServiceType,

            Status = ticket.Status.ToString(),

            EstimatedTime = 0
        };
    }

}