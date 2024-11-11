using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedReagent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PosExpectedRange",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "NegExpectedRange",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "AHG",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckCell",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImmediateSpin",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThirtySevenDegree",
                table: "Reagents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4246), new DateTime(2024, 11, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4253), new DateTime(2024, 11, 8, 9, 31, 35, 428, DateTimeKind.Local).AddTicks(4273) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AHG",
                table: "Reagents");

            migrationBuilder.DropColumn(
                name: "CheckCell",
                table: "Reagents");

            migrationBuilder.DropColumn(
                name: "ImmediateSpin",
                table: "Reagents");

            migrationBuilder.DropColumn(
                name: "ThirtySevenDegree",
                table: "Reagents");

            migrationBuilder.AlterColumn<bool>(
                name: "PosExpectedRange",
                table: "Reagents",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "NegExpectedRange",
                table: "Reagents",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6035), new DateTime(2024, 11, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6042), new DateTime(2024, 11, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6064) });
        }
    }
}
