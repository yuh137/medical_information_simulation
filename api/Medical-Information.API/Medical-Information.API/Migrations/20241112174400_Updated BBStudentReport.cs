using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedBBStudentReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.DropIndex(
                name: "IX_StudentReports_BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.DropColumn(
                name: "BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.CreateTable(
                name: "BBStudentReports",
                columns: table => new
                {
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BloodBankQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BBStudentReports", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_BBStudentReports_BloodBankQCLots_BloodBankQCLotID",
                        column: x => x.BloodBankQCLotID,
                        principalTable: "BloodBankQCLots",
                        principalColumn: "BloodBankQCLotID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BBStudentReports_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReagentInput",
                columns: table => new
                {
                    ReagentInputID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReagentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PosExpectedRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NegExpectedRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImmediateSpin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThirtySevenDegree = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AHG = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CheckCell = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BBStudentReportReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReagentInput", x => x.ReagentInputID);
                    table.ForeignKey(
                        name: "FK_ReagentInput_BBStudentReports_BBStudentReportReportID",
                        column: x => x.BBStudentReportReportID,
                        principalTable: "BBStudentReports",
                        principalColumn: "ReportID");
                });

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8688), new DateTime(2024, 11, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8701), new DateTime(2024, 11, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8739) });

            migrationBuilder.CreateIndex(
                name: "IX_BBStudentReports_BloodBankQCLotID",
                table: "BBStudentReports",
                column: "BloodBankQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_BBStudentReports_StudentID",
                table: "BBStudentReports",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_ReagentInput_BBStudentReportReportID",
                table: "ReagentInput",
                column: "BBStudentReportReportID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReagentInput");

            migrationBuilder.DropTable(
                name: "BBStudentReports");

            migrationBuilder.AddColumn<Guid>(
                name: "BloodBankQCLotID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1414), new DateTime(2024, 11, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1419), new DateTime(2024, 11, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1444) });

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_BloodBankQCLotID",
                table: "StudentReports",
                column: "BloodBankQCLotID");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_BloodBankQCLotID",
                table: "StudentReports",
                column: "BloodBankQCLotID",
                principalTable: "BloodBankQCLots",
                principalColumn: "BloodBankQCLotID");
        }
    }
}
