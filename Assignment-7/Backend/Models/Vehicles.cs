using System.ComponentModel.DataAnnotations;

namespace Mini_logistics_system.Models
{
    public class Vehicles
    {
        [Key]
        public int VehicleId { get; set; }
        public string VehicleNumber { get; set; }
        public string VehicleType { get; set; }
        public string VehicleModel { get; set; }
        public bool IsAvailable { get; set; }

        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();

    }
}
