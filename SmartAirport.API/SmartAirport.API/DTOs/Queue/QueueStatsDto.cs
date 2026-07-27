namespace SmartAirport.API.DTOs;

public class QueueStatsDto
{
    public int Waiting { get; set; }
    public int Served { get; set; }
    public int Completed { get; set; }
    public int Cancelled { get; set; }
}