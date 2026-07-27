using SmartAirport.API.DTOs;
using SmartAirport.API.DTOs.Queue;

namespace SmartAirport.API.Services.Interfaces;

public interface IQueueService
{
    Task<QueueStatsResponse> GetStats(string serviceType);

    Task<List<TicketResponse>> GetQueue(string serviceType);

    Task<CurrentTicketResponse?> GetCurrentTicket(int counterId);

    Task<bool> CallNext(string serviceType, int counterId);

    Task<bool> CompleteTicket(int counterId);
}