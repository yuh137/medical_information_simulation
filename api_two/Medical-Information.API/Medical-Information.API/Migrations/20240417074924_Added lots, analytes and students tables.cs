using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class Addedlotsanalytesandstudentstables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminQCLots",
                columns: table => new
                {
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LotNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClosedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Department = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminQCLots", x => x.AdminQCLotID);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentID);
                });

            migrationBuilder.CreateTable(
                name: "Analytes",
                columns: table => new
                {
                    AnalyteID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnalyteName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnalyteAcronym = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mean = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StdDevi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Electrolyte = table.Column<bool>(type: "bit", nullable: false),
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analytes", x => x.AnalyteID);
                    table.ForeignKey(
                        name: "FK_Analytes_AdminQCLots_AdminQCLotID",
                        column: x => x.AdminQCLotID,
                        principalTable: "AdminQCLots",
                        principalColumn: "AdminQCLotID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analytes_AdminQCLotID",
                table: "Analytes",
                column: "AdminQCLotID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analytes");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "AdminQCLots");
        }
    }
}
