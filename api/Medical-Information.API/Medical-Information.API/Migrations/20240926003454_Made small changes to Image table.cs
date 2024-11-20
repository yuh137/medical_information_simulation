using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class MadesmallchangestoImagetable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileExtension",
                table: "Images",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7820), new DateTime(2024, 9, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7825), new DateTime(2024, 9, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7842) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileExtension",
                table: "Images");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 25, 0, 2, 43, 556, DateTimeKind.Local).AddTicks(3936), new DateTime(2024, 9, 25, 0, 2, 43, 556, DateTimeKind.Local).AddTicks(3941), new DateTime(2024, 9, 25, 0, 2, 43, 556, DateTimeKind.Local).AddTicks(3958) });
        }
    }
}
