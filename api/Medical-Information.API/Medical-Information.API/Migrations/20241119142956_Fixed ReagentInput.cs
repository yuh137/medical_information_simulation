using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class FixedReagentInput : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReagentInput_BBStudentReports_BBStudentReportReportID",
                table: "ReagentInput");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReagentInput",
                table: "ReagentInput");

            migrationBuilder.RenameTable(
                name: "ReagentInput",
                newName: "ReagentInputs");

            migrationBuilder.RenameIndex(
                name: "IX_ReagentInput_BBStudentReportReportID",
                table: "ReagentInputs",
                newName: "IX_ReagentInputs_BBStudentReportReportID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReagentInputs",
                table: "ReagentInputs",
                column: "ReagentInputID");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 19, 8, 29, 55, 942, DateTimeKind.Local).AddTicks(6478), new DateTime(2024, 11, 19, 8, 29, 55, 942, DateTimeKind.Local).AddTicks(6490), new DateTime(2024, 11, 19, 8, 29, 55, 942, DateTimeKind.Local).AddTicks(6522) });

            migrationBuilder.AddForeignKey(
                name: "FK_ReagentInputs_BBStudentReports_BBStudentReportReportID",
                table: "ReagentInputs",
                column: "BBStudentReportReportID",
                principalTable: "BBStudentReports",
                principalColumn: "ReportID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReagentInputs_BBStudentReports_BBStudentReportReportID",
                table: "ReagentInputs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReagentInputs",
                table: "ReagentInputs");

            migrationBuilder.RenameTable(
                name: "ReagentInputs",
                newName: "ReagentInput");

            migrationBuilder.RenameIndex(
                name: "IX_ReagentInputs_BBStudentReportReportID",
                table: "ReagentInput",
                newName: "IX_ReagentInput_BBStudentReportReportID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReagentInput",
                table: "ReagentInput",
                column: "ReagentInputID");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2613), new DateTime(2024, 11, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2619), new DateTime(2024, 11, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2639) });

            migrationBuilder.AddForeignKey(
                name: "FK_ReagentInput_BBStudentReports_BBStudentReportReportID",
                table: "ReagentInput",
                column: "BBStudentReportReportID",
                principalTable: "BBStudentReports",
                principalColumn: "ReportID");
        }
    }
}
