namespace SmartAirport.API.DTOs;

public class CreateTicketRequest
{
    public string FlightNumber { get; set; }
    public string FlightCode { get; set; }

    public string ServiceType { get; set; }
}