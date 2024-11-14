using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class FixedBBQCLot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2613), new DateTime(2024, 11, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2619), new DateTime(2024, 11, 13, 12, 22, 33, 538, DateTimeKind.Local).AddTicks(2639) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8688), new DateTime(2024, 11, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8701), new DateTime(2024, 11, 12, 11, 43, 59, 777, DateTimeKind.Local).AddTicks(8739) });
        }
    }
}
