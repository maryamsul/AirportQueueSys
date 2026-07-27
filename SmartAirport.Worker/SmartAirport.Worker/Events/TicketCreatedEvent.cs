using System;
using System.Collections.Generic;
using System.Text;

namespace SmartAirport.Worker.Events
{
    
    public class TicketCreatedEvent
    {
        public int TicketId { get; set; }

        public string QueueNumber { get; set; }

        public string ServiceType { get; set; }

        public string FlightNumber { get; set; }
    }
}
