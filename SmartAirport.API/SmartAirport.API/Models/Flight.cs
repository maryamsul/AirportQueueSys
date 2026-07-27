namespace SmartAirport.API.Models;

public class Flight
{
    public int FlightId { get; set; }

    public string FlightCode { get; set; }

    public string? Destination { get; set; }

    public string? Airline { get; set; }

    public DateTime? DepartureTime { get; set; }

    public string? FlightNumber { get; set; }
}