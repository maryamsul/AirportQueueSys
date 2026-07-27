using Azure.Messaging.ServiceBus;
using SmartAirport.Worker.Events;
using System.Text.Json;

namespace SmartAirport.Worker;


public class Worker : BackgroundService
{
    private readonly IConfiguration _configuration;

    private ServiceBusProcessor _processor;


    public Worker(IConfiguration configuration)
    {
        _configuration = configuration;
    }



    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {

        var client = new ServiceBusClient(
            _configuration["AzureServiceBus:ConnectionString"]);


        _processor = client.CreateProcessor(
            _configuration["AzureServiceBus:QueueName"],
            new ServiceBusProcessorOptions());


        _processor.ProcessMessageAsync += ProcessMessage;

        _processor.ProcessErrorAsync += ErrorHandler;


        await _processor.StartProcessingAsync(stoppingToken);


        Console.WriteLine("Worker started listening...");


        await Task.Delay(
            Timeout.Infinite,
            stoppingToken);
    }



    private async Task ProcessMessage(
        ProcessMessageEventArgs args)
    {

        string body = args.Message.Body.ToString();


        var ticket =
            JsonSerializer.Deserialize<TicketCreatedEvent>(body);



        Console.WriteLine("Ticket Received");

        Console.WriteLine(
            $"ID: {ticket.TicketId}");

        Console.WriteLine(
            $"Queue: {ticket.QueueNumber}");

        Console.WriteLine(
            $"Service: {ticket.ServiceType}");



        await args.CompleteMessageAsync(
            args.Message);
    }



    private Task ErrorHandler(
        ProcessErrorEventArgs args)
    {
        Console.WriteLine(
            args.Exception.Message);

        return Task.CompletedTask;
    }
}