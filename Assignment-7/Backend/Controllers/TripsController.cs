using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mini_logistics_system.Data;
using Mini_logistics_system.Models;

namespace Mini_logistics_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TripsController(AppDbContext db) => _db = db;

        // Get all trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetAll() =>
            await _db.Trips
                //.Include(t => t.Drivers)
                //.Include(t => t.Vehicles)
                .ToListAsync();

        // Get trip by ID
        [HttpGet("GetById")]
        public async Task<ActionResult<Trip>> Get([FromQuery] int id)
        {
            var trip = await _db.Trips
                //.Include(t => t.Drivers)
                //.Include(t => t.Vehicles)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null) return NotFound();
            return Ok(trip);
        }

        // Add Trip (assign driver + vehicle)
        [HttpPost]
        public async Task<ActionResult> Create(Trip trip)
        {
            var driver = await _db.Drivers.FindAsync(trip.DriverId);
            var vehicle = await _db.Vehicles.FindAsync(trip.VehicleId);

            if (driver == null || vehicle == null)
                return BadRequest("Driver or Vehicle not found.");

            if (!driver.IsAvailable)
                return BadRequest("Driver is not available.");
            if (!vehicle.IsAvailable)
                return BadRequest("Vehicle is not available.");

            driver.IsAvailable = false;
            vehicle.IsAvailable = false;

            _db.Trips.Add(trip);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = trip.Id }, trip);
        }

        // Update Trip
        [HttpPut("UpdateTrip")]
        public async Task<ActionResult> Update([FromQuery] int id, Trip trip)
        {
            if (id == trip.Id)
            {
                var existing = await _db.Trips.FindAsync(id);
                if (existing == null) return NotFound("Trip not found.");

                // Completed trips cannot be edited
                if (existing.Status == "Completed")
                    return BadRequest("Completed trips cannot be updated.");

                // Ongoing trips can only change destination
                if (existing.Status == "Ongoing")
                {
                    existing.Destination = trip.Destination;
                }
                else
                {
                    // Scheduled trips can change driver, vehicle, source, destination
                    existing.DriverId = trip.DriverId;
                    existing.VehicleId = trip.VehicleId;
                    existing.Source = trip.Source;
                    existing.Destination = trip.Destination;
                    existing.StartDate = trip.StartDate;
                    existing.EndDate = trip.EndDate;
                }

                await _db.SaveChangesAsync();
                return Ok();
            }

            return BadRequest("Trip ID mismatch.");
        }



        // Delete Trip
        [HttpDelete("DeleteTrip")]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            var trip = await _db.Trips.Include(x => x.Drivers).Include(x => x.Vehicles).FirstOrDefaultAsync(x => x.Id == id);
            if (trip == null) return NotFound();

            if (trip.Drivers != null) trip.Drivers.IsAvailable = true;
            if (trip.Vehicles != null) trip.Vehicles.IsAvailable = true;

            _db.Trips.Remove(trip);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("CompleteTrip")]
        public async Task<ActionResult> CompleteTrip([FromQuery] int id)
        {
            var trip = await _db.Trips
                .Include(t => t.Drivers)
                .Include(t => t.Vehicles)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null) return NotFound("Trip not found.");
            trip.Status = "Completed";

            if (trip.Drivers != null) trip.Drivers.IsAvailable = true;
            if (trip.Vehicles != null) trip.Vehicles.IsAvailable = true;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Trip marked as completed." });

        }


        // Trips longer than 8 hours
        [HttpGet("LongTrips")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetLongTrips()
        {
            var longTrips = await _db.Trips
                .Where(t => EF.Functions.DateDiffHour(t.StartDate, t.EndDate) > 8)
                .Include(t => t.Drivers)
                .Include(t => t.Vehicles)
                .ToListAsync();

            return Ok(longTrips);
        }
    }
}
