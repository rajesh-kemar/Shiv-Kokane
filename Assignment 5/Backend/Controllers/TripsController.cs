using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQL_API.Data;
using SQL_API.dto;
using SQL_API.Models;

namespace SQL_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripsController(AppDbContext context)
        {
            _context = context;
        }


        //GET ALL TRIP
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trips = await _context.Trips
                .ToListAsync();
            return Ok(trips);
        }

        //GET TRIP BY ID
        [HttpGet]
        [Route("TripbyID")]
        public async Task<IActionResult> Get([FromQuery] int id)
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(t => t.TripId == id);
            if (trip == null) return NotFound();
            return Ok(trip);
        }

        //  ADD TRIP 
        [HttpPost]
        [Route("AddTrip")]
        public async Task<IActionResult> Create([FromBody] Trip trip)
        {
            if (trip == null) return BadRequest();

            //Trip tripRequest = new Trip();
            //tripRequest.TripId = trip.TripId;
            //tripRequest.Source = trip.Source;
            //tripRequest.Destination = trip.Destination;
            //tripRequest.Status = trip.Status;
            //tripRequest.VehicleId = trip.VehicleId;
            //tripRequest.DriverId = trip.DriverId;

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = trip.TripId }, trip);
        }

        //UPDATE TRIP
        [HttpPut]
        [Route("UpdateTrip")]
        public async Task<IActionResult> UpdateTrip([FromQuery]int id, [FromBody] Trip updatedTrip)
        {
            if (updatedTrip == null || id != updatedTrip.TripId)
                return BadRequest("Invalid trip data.");

            var existingTrip = await _context.Trips.FindAsync(id);
            if (existingTrip == null)
                return NotFound("Trip not found.");

            existingTrip.Source = updatedTrip.Source;
            existingTrip.Destination = updatedTrip.Destination;
            existingTrip.Status = updatedTrip.Status;
            existingTrip.DriverId = updatedTrip.DriverId;
            existingTrip.VehicleId = updatedTrip.VehicleId;

            await _context.SaveChangesAsync();

            return Ok(existingTrip); // return updated trip data
        }

        //MARK TRIP COMPLETE
        [HttpPut("MarkComplete")]
        public async Task<IActionResult> MarkComplete([FromQuery] int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();

            trip.Status = "Completed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Trip marked as completed" });
        }


        //DELETE TRIP
        [HttpDelete]
        [Route("DeleteTrip")]
        public async Task<IActionResult> Delete([FromQuery] int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
                return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Trip deleted successfully" });
        }

    }

}

