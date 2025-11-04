namespace SQL_API.Models
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        //public int YearOfExperience {  get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();

    }
}
