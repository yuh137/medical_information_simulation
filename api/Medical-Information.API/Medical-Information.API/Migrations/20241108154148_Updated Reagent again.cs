using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedReagentagain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 9, 41, 48, 257, DateTimeKind.Local).AddTicks(550), new DateTime(2024, 11, 8, 9, 41, 48, 257, DateTimeKind.Local).AddTicks(556), new DateTime(2024, 11, 8, 9, 41, 48, 257, DateTimeKind.Local).AddTicks(584) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4246), new DateTime(2024, 11, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4253), new DateTime(2024, 11, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4273) });
        }
    }
}
