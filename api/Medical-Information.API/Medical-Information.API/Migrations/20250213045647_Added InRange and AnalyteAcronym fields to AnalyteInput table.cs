using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedInRangeandAnalyteAcronymfieldstoAnalyteInputtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnalyteAcronym",
                table: "AnalyteInputs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "InRange",
                table: "AnalyteInputs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2025, 2, 13, 11, 56, 47, 151, DateTimeKind.Local).AddTicks(575), new DateTime(2025, 2, 13, 11, 56, 47, 151, DateTimeKind.Local).AddTicks(595) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnalyteAcronym",
                table: "AnalyteInputs");

            migrationBuilder.DropColumn(
                name: "InRange",
                table: "AnalyteInputs");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2025, 2, 13, 10, 50, 58, 166, DateTimeKind.Local).AddTicks(9982), new DateTime(2025, 2, 13, 10, 50, 58, 167, DateTimeKind.Local).AddTicks(5) });
        }
    }
}
