namespace SmartAirport.API.DTOs;

public class SelectServiceResponse
{
    public string Token { get; set; } = "";

    public string ServiceType { get; set; } = "";

    public int CounterId { get; set; }
}