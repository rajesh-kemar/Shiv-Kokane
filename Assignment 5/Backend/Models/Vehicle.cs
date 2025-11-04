namespace SQL_API.Models
{
    public class Vehicle
    {

        public int VehicleId { get; set; }
        public string VehicleNumber { get; set; }
        public string Type { get; set; }
        public string VehicleModel { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
       
    }
}
