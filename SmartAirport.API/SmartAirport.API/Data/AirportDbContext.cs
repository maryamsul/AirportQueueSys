using Microsoft.EntityFrameworkCore;
using SmartAirport.API.Models;
using SmartAirportQueue.Models;

namespace SmartAirport.API.Data;

public class AirportDbContext : DbContext
{
    public AirportDbContext(DbContextOptions<AirportDbContext> options) : base(options)
    {
    }

    public DbSet<QueueTicket> QueueTickets { get; set; }
    public DbSet<Flight> Flights { get; set; }
    public DbSet<User> Users { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<QueueTicket>()
            .Property(t => t.Status)
            .HasConversion<string>();
    }

}