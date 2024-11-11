using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedReagentx4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8183), new DateTime(2024, 11, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8192), new DateTime(2024, 11, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8212) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(531), new DateTime(2024, 11, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(537), new DateTime(2024, 11, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(562) });
        }
    }
}
