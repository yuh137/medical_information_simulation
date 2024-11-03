using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AddActiveStatustoQCLot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "AdminQCLots",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "IsActive", "OpenDate" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 9, 29, 23, 54, 13, 789, DateTimeKind.Local).AddTicks(5912), false, new DateTime(2024, 9, 29, 23, 54, 13, 789, DateTimeKind.Local).AddTicks(5931) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "AdminQCLots");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7820), new DateTime(2024, 9, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7825), new DateTime(2024, 9, 25, 19, 34, 53, 885, DateTimeKind.Local).AddTicks(7842) });
        }
    }
}
