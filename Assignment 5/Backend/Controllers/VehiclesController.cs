using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQL_API.Data;
using SQL_API.Models;
using System.Linq;
using System.Threading.Tasks;

namespace SQL_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehiclesController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL VEHICLES
        [HttpGet]
        public async Task<IActionResult> GetVehicles()
        {
            var vehicles = await _context.Vehicles
               
                .ToListAsync();

            return Ok(vehicles);
        }

        //  GET VEHICLE BY ID 
        [HttpGet]
        [Route("VehiclebyID")]
        public async Task<IActionResult> GetVehicleById([FromQuery] int id)
        {
            var vehicle = await _context.Vehicles
               
                .FirstOrDefaultAsync(v => v.VehicleId == id);

            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            return Ok(vehicle);
        }

        //  GET AVAILABLE VEHICLES 
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable()
        {
            var available = await _context.Vehicles
                .Where(v => !v.Trips.Any(tr => tr.Status.ToLower() == "Ongoing"))
                .ToListAsync();

            return Ok(available);
        }

        //  ADD NEW VEHICLE 
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
                return BadRequest();

            await _context.Vehicles.AddAsync(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleById), new { id = vehicle.VehicleId }, vehicle);
        }

        // UPDATE VEHICLE 
        [HttpPut]
        [Route("UpdateVehicle")]
        public async Task<IActionResult> UpdateVehicle([FromQuery] int id, [FromBody] Vehicle vehicle)
        {
            if (id != vehicle.VehicleId)
                return BadRequest(new { message = "Vehicle ID mismatch" });

            var existingVehicle = await _context.Vehicles.FindAsync(id);
            if (existingVehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            existingVehicle.VehicleNumber = vehicle.VehicleNumber;
            existingVehicle.Type = vehicle.Type;
            existingVehicle.VehicleModel = vehicle.VehicleModel;

            _context.Vehicles.Update(existingVehicle);
            await _context.SaveChangesAsync();

            return Ok(existingVehicle);
        }

        // DELETE VEHICLE 
        [HttpDelete]
        [Route("DeleteVehicle")]
        public async Task<IActionResult> DeleteVehicle([FromQuery] int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle deleted successfully" });
        }
    }
}
