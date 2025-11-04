using Microsoft.EntityFrameworkCore;
using SQL_API.Models;
using System.Collections.Generic;
using System.Reflection.Emit;


namespace SQL_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Sd
            modelBuilder.Entity<Driver>().HasData(
                new Driver { DriverId = 101, DriverName = "Rajesh Patil" },
                new Driver { DriverId = 102, DriverName = "Sneha Kulkarni" },
                new Driver { DriverId = 103, DriverName = "Kiran Deshmukh" },
                new Driver { DriverId = 104, DriverName = "Anjali Sharma" }
            );

            modelBuilder.Entity<Vehicle>().HasData(
                new Vehicle { VehicleId = 1, VehicleNumber = "MH12AB1234", Type = "Van", VehicleModel = "Tata Ace" },
                new Vehicle { VehicleId = 2, VehicleNumber = "MH14CD5678", Type = "Truck", VehicleModel = "Eicher Pro" },
                new Vehicle { VehicleId = 3, VehicleNumber = "MH31EF7890", Type = "Mini Van", VehicleModel = "Maruti Omni" },
                new Vehicle { VehicleId = 4, VehicleNumber = "MH22GH1234", Type = "Bus", VehicleModel = "Volvo 9400" },
                new Vehicle { VehicleId = 5, VehicleNumber = "MH33JK5678", Type = "Van", VehicleModel = "Mahindra Supro" }
            );

            
            modelBuilder.Entity<Trip>().HasData(
                new Trip { TripId = 1, Source = "Pune", Destination = "Mumbai", Status = "Completed", DriverId = 101, VehicleId = 1 },
                new Trip { TripId = 2, Source = "Nashik", Destination = "Aurangabad", Status = "Ongoing", DriverId = 102, VehicleId = 2 },
                new Trip { TripId = 3, Source = "Nagpur", Destination = "Amravati", Status = "Scheduled", DriverId = 103, VehicleId = 3 },
                new Trip { TripId = 4, Source = "Pune", Destination = "Nashik", Status = "Scheduled", DriverId = 104, VehicleId = 4 },
                new Trip { TripId = 5, Source = "Mumbai", Destination = "Pune", Status = "Scheduled", DriverId = 101, VehicleId = 5 },
                new Trip { TripId = 6, Source = "Aurangabad", Destination = "Nashik", Status = "Scheduled", DriverId = 102, VehicleId = 1 },
                new Trip { TripId = 7, Source = "Amravati", Destination = "Nagpur", Status = "Scheduled", DriverId = 103, VehicleId = 2 },
                new Trip { TripId = 8, Source = "Pune", Destination = "Aurangabad", Status = "Scheduled", DriverId = 104, VehicleId = 3 },
                new Trip { TripId = 9, Source = "Mumbai", Destination = "Nagpur", Status = "Scheduled", DriverId = 101, VehicleId = 4 },
                new Trip { TripId = 10, Source = "Nashik", Destination = "Pune", Status = "Scheduled", DriverId = 102, VehicleId = 5 }
            );
        }
    }
}
