using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedReagentInput : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BloodBankQCLots",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1414), new DateTime(2024, 11, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1419), new DateTime(2024, 11, 11, 12, 3, 22, 997, DateTimeKind.Local).AddTicks(1444) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BloodBankQCLots");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8183), new DateTime(2024, 11, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8192), new DateTime(2024, 11, 11, 9, 10, 57, 761, DateTimeKind.Local).AddTicks(8212) });
        }
    }
}
