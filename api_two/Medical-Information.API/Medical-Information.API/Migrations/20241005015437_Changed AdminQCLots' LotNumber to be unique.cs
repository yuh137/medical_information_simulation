using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class ChangedAdminQCLotsLotNumbertobeunique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LotNumber",
                table: "AdminQCLots",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 4, 20, 54, 36, 769, DateTimeKind.Local).AddTicks(1986), new DateTime(2024, 10, 4, 20, 54, 36, 769, DateTimeKind.Local).AddTicks(2003) });

            migrationBuilder.CreateIndex(
                name: "IX_AdminQCLots_LotNumber",
                table: "AdminQCLots",
                column: "LotNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AdminQCLots_LotNumber",
                table: "AdminQCLots");

            migrationBuilder.AlterColumn<string>(
                name: "LotNumber",
                table: "AdminQCLots",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 9, 29, 23, 54, 13, 789, DateTimeKind.Local).AddTicks(5912), new DateTime(2024, 9, 29, 23, 54, 13, 789, DateTimeKind.Local).AddTicks(5931) });
        }
    }
}
