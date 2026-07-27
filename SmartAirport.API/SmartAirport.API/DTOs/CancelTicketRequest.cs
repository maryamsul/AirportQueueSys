namespace SmartAirport.API.DTOs;

public class CancelTicketRequest
{
    public string FlightCode { get; set; } = "";

    public string? Reason { get; set; }
}