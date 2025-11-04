namespace SQL_API.dto
{
    public class TripRequest
    {
        public int TripId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Status { get; set; }

        public int DriverId { get; set; }
        public int VehicleId { get; set; }
    }
}
