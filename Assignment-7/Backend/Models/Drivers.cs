using System.ComponentModel.DataAnnotations;

namespace Mini_logistics_system.Models
{
    public class Drivers
    {
        [Key]
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public string LicenseNumber { get; set; }
        public int YearOfExperience { get; set; }
        public bool IsAvailable { get; set; }
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
