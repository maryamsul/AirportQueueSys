using Azure.Messaging.ServiceBus;
using System.Text.Json;

namespace SmartAirport.API.Services;

public class ServiceBusPublisher
{
    private readonly ServiceBusClient _client;
    private readonly IConfiguration _configuration;


    public ServiceBusPublisher(
        IConfiguration configuration)
    {
        _configuration = configuration;

        _client = new ServiceBusClient(
            _configuration["AzureServiceBus:ConnectionString"]);
    }


    public async Task PublishAsync<T>(T message)
    {
        var queueName =
            _configuration["AzureServiceBus:QueueName"];

        Console.WriteLine($"Sending to queue: {queueName}");

        ServiceBusSender sender =
            _client.CreateSender(queueName);


        string json =
            JsonSerializer.Serialize(message);


        ServiceBusMessage serviceBusMessage =
            new(json);


        await sender.SendMessageAsync(serviceBusMessage);
    }
}