using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedReagentx3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.AddColumn<Guid>(
                name: "BloodBankQCLotID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(531), new DateTime(2024, 11, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(537), new DateTime(2024, 11, 8, 12, 55, 20, 945, DateTimeKind.Local).AddTicks(562) });

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_BloodBankQCLotID",
                table: "StudentReports",
                column: "BloodBankQCLotID");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_BloodBankQCLotID",
                table: "StudentReports",
                column: "BloodBankQCLotID",
                principalTable: "BloodBankQCLots",
                principalColumn: "BloodBankQCLotID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.DropIndex(
                name: "IX_StudentReports_BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.DropColumn(
                name: "BloodBankQCLotID",
                table: "StudentReports");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 8, 11, 0, 49, 55, DateTimeKind.Local).AddTicks(959), new DateTime(2024, 11, 8, 11, 0, 49, 55, DateTimeKind.Local).AddTicks(966), new DateTime(2024, 11, 8, 11, 0, 49, 55, DateTimeKind.Local).AddTicks(987) });

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_BloodBankQCLots_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID",
                principalTable: "BloodBankQCLots",
                principalColumn: "BloodBankQCLotID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
