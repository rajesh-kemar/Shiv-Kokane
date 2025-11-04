using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SQL_API.Migrations
{
    /// <inheritdoc />
    public partial class ionity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    DriverId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DriverName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.DriverId);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    VehicleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleModel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.VehicleId);
                });

            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Source = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DriverId = table.Column<int>(type: "int", nullable: false),
                    VehicleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.TripId);
                    table.ForeignKey(
                        name: "FK_Trips_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "DriverId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Trips_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "VehicleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Drivers",
                columns: new[] { "DriverId", "DriverName" },
                values: new object[,]
                {
                    { 101, "Rajesh Patil" },
                    { 102, "Sneha Kulkarni" },
                    { 103, "Kiran Deshmukh" },
                    { 104, "Anjali Sharma" }
                });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "VehicleId", "Type", "VehicleModel", "VehicleNumber" },
                values: new object[,]
                {
                    { 1, "Van", "Tata Ace", "MH12AB1234" },
                    { 2, "Truck", "Eicher Pro", "MH14CD5678" },
                    { 3, "Mini Van", "Maruti Omni", "MH31EF7890" },
                    { 4, "Bus", "Volvo 9400", "MH22GH1234" },
                    { 5, "Van", "Mahindra Supro", "MH33JK5678" }
                });

            migrationBuilder.InsertData(
                table: "Trips",
                columns: new[] { "TripId", "Destination", "DriverId", "Source", "Status", "VehicleId" },
                values: new object[,]
                {
                    { 1, "Mumbai", 101, "Pune", "Completed", 1 },
                    { 2, "Aurangabad", 102, "Nashik", "Ongoing", 2 },
                    { 3, "Amravati", 103, "Nagpur", "Scheduled", 3 },
                    { 4, "Nashik", 104, "Pune", "Scheduled", 4 },
                    { 5, "Pune", 101, "Mumbai", "Scheduled", 5 },
                    { 6, "Nashik", 102, "Aurangabad", "Scheduled", 1 },
                    { 7, "Nagpur", 103, "Amravati", "Scheduled", 2 },
                    { 8, "Aurangabad", 104, "Pune", "Scheduled", 3 },
                    { 9, "Nagpur", 101, "Mumbai", "Scheduled", 4 },
                    { 10, "Pune", 102, "Nashik", "Scheduled", 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trips_DriverId",
                table: "Trips",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_VehicleId",
                table: "Trips",
                column: "VehicleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trips");

            migrationBuilder.DropTable(
                name: "Drivers");

            migrationBuilder.DropTable(
                name: "Vehicles");
        }
    }
}
