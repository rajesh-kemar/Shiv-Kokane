using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mini_logistics_system.Data;
using Mini_logistics_system.Models;

namespace Mini_logistics_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public VehiclesController(AppDbContext db) => _db = db;

        // Get All Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicles>>> GetAll() =>
            await _db.Vehicles.ToListAsync();

        // Get Vehicle by ID
        [HttpGet("GetById")]
        public async Task<ActionResult<Vehicles>> Get([FromQuery] int id)
        {
            var vehicle = await _db.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        // Add Vehicle
        [HttpPost]
        public async Task<ActionResult> Create(Vehicles vehicle)
        {
            _db.Vehicles.Add(vehicle);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = vehicle.VehicleId }, vehicle);
        }

        // Update Vehicle
        [HttpPut("UpdateVehicle")]
        public async Task<ActionResult> Update([FromQuery] int id, Vehicles vehicle)
        {
            if (id != vehicle.VehicleId) return BadRequest("Vehicle ID mismatch.");
            _db.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_db.Vehicles.Any(v => v.VehicleId == id))
                    return NotFound();
                else
                    throw;
            }
            // await _db.SaveChangesAsync();
            return NoContent();
        }

        // Delete Vehicle
        [HttpDelete("DeleteVehicle")]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            var vehicle = await _db.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            _db.Vehicles.Remove(vehicle);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
