namespace SQL_API.Models
{
    public class Trip
    {
        public int TripId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Status { get; set; }

        public int DriverId { get; set; }
        public int VehicleId { get; set; }

        // Navigation properties
        public Driver? Driver { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
