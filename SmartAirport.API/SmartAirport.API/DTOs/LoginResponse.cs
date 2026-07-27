namespace SmartAirport.API.DTOs
{
    public class LoginResponse
    {
        public int UserId { get; set; }

        public string FullName { get; set; } = "";

        public string Role { get; set; } = "";

        public string Token { get; set; } = "";
    }
}
