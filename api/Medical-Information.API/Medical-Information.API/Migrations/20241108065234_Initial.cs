using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminQCLots",
                columns: table => new
                {
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QCName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LotNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OpenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClosedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FileDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Department = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminQCLots", x => x.AdminQCLotID);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    AdminID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Firstname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Initials = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.AdminID);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileExtension = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSizeInBytes = table.Column<long>(type: "bigint", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageId);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Firstname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Initials = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                    Type = table.Column<int>(type: "int", nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinLevel = table.Column<float>(type: "real", nullable: true),
                    MaxLevel = table.Column<float>(type: "real", nullable: true),
                    Mean = table.Column<float>(type: "real", nullable: true),
                    StdDevi = table.Column<float>(type: "real", nullable: true),
                    ExpectedRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
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

            migrationBuilder.CreateTable(
                name: "AdminStudent",
                columns: table => new
                {
                    AdminsAdminID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentsStudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminStudent", x => new { x.AdminsAdminID, x.StudentsStudentID });
                    table.ForeignKey(
                        name: "FK_AdminStudent_Admins_AdminsAdminID",
                        column: x => x.AdminsAdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdminStudent_Students_StudentsStudentID",
                        column: x => x.StudentsStudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentReports",
                columns: table => new
                {
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentReports", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_StudentReports_AdminQCLots_AdminQCLotID",
                        column: x => x.AdminQCLotID,
                        principalTable: "AdminQCLots",
                        principalColumn: "AdminQCLotID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentReports_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalyteInputs",
                columns: table => new
                {
                    AnalyteInputID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnalyteName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnalyteValue = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyteInputs", x => x.AnalyteInputID);
                    table.ForeignKey(
                        name: "FK_AnalyteInputs_StudentReports_ReportID",
                        column: x => x.ReportID,
                        principalTable: "StudentReports",
                        principalColumn: "ReportID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminQCLots_LotNumber",
                table: "AdminQCLots",
                column: "LotNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdminStudent_StudentsStudentID",
                table: "AdminStudent",
                column: "StudentsStudentID");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyteInputs_ReportID",
                table: "AnalyteInputs",
                column: "ReportID");

            migrationBuilder.CreateIndex(
                name: "IX_Analytes_AdminQCLotID",
                table: "Analytes",
                column: "AdminQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_StudentID",
                table: "StudentReports",
                column: "StudentID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminStudent");

            migrationBuilder.DropTable(
                name: "AnalyteInputs");

            migrationBuilder.DropTable(
                name: "Analytes");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "StudentReports");

            migrationBuilder.DropTable(
                name: "AdminQCLots");

            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
