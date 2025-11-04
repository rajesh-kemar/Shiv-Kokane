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
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriversController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL DRIVERS 
        [HttpGet]
        public async Task<IActionResult> GetDrivers()
        {
            var drivers = await _context.Drivers
           
                .ToListAsync();

            return Ok(drivers);
        }

        //GET DRIVER BY ID 
        [HttpGet]
        [Route("DriverbyID")]
        public async Task<IActionResult> GetDriverById([FromQuery] int id)
        {
            var driver = await _context.Drivers
                //.Include(d => d.Trips)
                .FirstOrDefaultAsync(d => d.DriverId == id);

            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            return Ok(driver);
        }

        //  ADD NEW DRIVER
        [HttpPost]
        public async Task<IActionResult> CreateDriver([FromBody] Driver driver)
        {
            if (driver == null)
                return BadRequest();

            await _context.Drivers.AddAsync(driver);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDriverById), new { id = driver.DriverId }, driver);
        }

        //  UPDATE DRIVER 
        [HttpPut]
        [Route("AddDrivers")]
        public async Task<IActionResult> UpdateDriver([FromQuery] int id, [FromBody] Driver driver)
        {
            if (id != driver.DriverId)
                return BadRequest(new { message = "Driver ID mismatch" });

            var existingDriver = await _context.Drivers.FindAsync(id);
            if (existingDriver == null)
                return NotFound(new { message = "Driver not found" });

            existingDriver.DriverName = driver.DriverName;

            _context.Drivers.Update(existingDriver);
            await _context.SaveChangesAsync();

            return Ok(existingDriver);
        }

        //  DELETE DRIVER 
        [HttpDelete]
        [Route("DeleteDriver")]
        public async Task<IActionResult> DeleteDriver([FromQuery] int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver deleted successfully" });
        }
    }
}
