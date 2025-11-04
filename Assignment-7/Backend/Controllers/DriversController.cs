using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mini_logistics_system.Data;
using Mini_logistics_system.Models;

namespace Mini_logistics_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DriversController(AppDbContext db) => _db = db;

        //Get All Drivers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Drivers>>> GetAll() =>
          await _db.Drivers.ToListAsync();

        //Get Drivers by ID
        [HttpGet]
        [Route("GetbyId")]
        public async Task<ActionResult<Drivers>> Get([FromQuery] int id)
        {
            var driver = await _db.Drivers.FindAsync(id);
            if (driver == null) return NotFound();
            return Ok(driver);
        }


        //Add Drivers
        [HttpPost]
        public async Task<ActionResult> Create(Drivers driver)
        {
            _db.Drivers.Add(driver);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = driver.DriverId }, driver);
        }


        //Update Driver 
        [HttpPut]
        [Route("UpdateDrivers")]
        public async Task<ActionResult> Update([FromQuery] int id, Drivers driver)
        {
            if (id != driver.DriverId) return BadRequest();
            _db.Entry(driver).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_db.Drivers.Any(d => d.DriverId == id))
                    return NotFound();
                else
                    throw;
            }
            //  await _db.SaveChangesAsync();
            return Ok();
        }

        //Delete Driver
        [HttpDelete]
        [Route("DeleteDrivers")]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            var driver = await _db.Drivers.FindAsync(id);
            if (driver == null) return NotFound();
            _db.Drivers.Remove(driver);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
