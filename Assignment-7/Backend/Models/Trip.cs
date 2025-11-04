using System.ComponentModel.DataAnnotations;

namespace Mini_logistics_system.Models
{
    public class Trip
    {
        [Key]
        public int Id { get; set; }

        public int DriverId { get; set; }
        public Drivers? Drivers { get; set; }

        public int VehicleId { get; set; }
        public Vehicles? Vehicles { get; set; }


        public string Source { get; set; }
        public string Destination { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Schedule";

    }
}
