using System.ComponentModel.DataAnnotations;

namespace SmartAirport.API.Models;

public class QueueTicket
{
    [Key]
    public int TicketId { get; set; }

    public enum TicketStatus
    {
        Waiting,
        Served,
        Completed,
        Cancelled
    }

    public string QueueNumber { get; set; } = "";

    public string ServiceType { get; set; } = "";

    public TicketStatus Status { get; set; } = TicketStatus.Waiting;

    public DateTime CreatedAt { get; set; }

    public int? EstimatedTime { get; set; }

    public int? CounterId { get; set; }

    public string? FlightCode { get; set; }

    public string? FlightNumber { get; set; }
}