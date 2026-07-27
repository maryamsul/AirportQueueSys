namespace SmartAirport.API.DTOs;

public class TicketResponse
{
    public string TicketNumber { get; set; } = string.Empty;

    public string ServiceType { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public int EstimatedTime { get; set; }

    public DateTime CreatedAt { get; set; }
}
