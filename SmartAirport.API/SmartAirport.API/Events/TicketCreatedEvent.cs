namespace SmartAirport.API.Events;

public class TicketCreatedEvent
{
    public int TicketId { get; set; }

    public string QueueNumber { get; set; }

    public string ServiceType { get; set; }

    public string FlightNumber { get; set; }
}