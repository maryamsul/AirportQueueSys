namespace SmartAirport.API.DTOs;

public class SelectServiceRequest
{
    public string ServiceType { get; set; } = "";

    public int CounterId { get; set; }
}