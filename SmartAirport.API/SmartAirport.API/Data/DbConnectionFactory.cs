using Microsoft.Data.SqlClient;

namespace SmartAirport.API.Data;

public class DbConnectionFactory
{
    private readonly IConfiguration _configuration;


    public DbConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }


    public SqlConnection CreateConnection()
    {
        return new SqlConnection(
            _configuration.GetConnectionString("AirportConnection")
        );
    }
}