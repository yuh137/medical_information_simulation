using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminReportstoAdminQCLot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 16, 23, 32, 50, 46, DateTimeKind.Local).AddTicks(5236), new DateTime(2024, 10, 16, 23, 32, 50, 46, DateTimeKind.Local).AddTicks(5256) });

            migrationBuilder.CreateIndex(
                name: "IX_AdminAnalyteReports_AdminQCLotID",
                table: "AdminAnalyteReports",
                column: "AdminQCLotID");

            migrationBuilder.AddForeignKey(
                name: "FK_AdminAnalyteReports_AdminQCLots_AdminQCLotID",
                table: "AdminAnalyteReports",
                column: "AdminQCLotID",
                principalTable: "AdminQCLots",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminAnalyteReports_AdminQCLots_AdminQCLotID",
                table: "AdminAnalyteReports");

            migrationBuilder.DropIndex(
                name: "IX_AdminAnalyteReports_AdminQCLotID",
                table: "AdminAnalyteReports");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 16, 22, 54, 27, 685, DateTimeKind.Local).AddTicks(919), new DateTime(2024, 10, 16, 22, 54, 27, 685, DateTimeKind.Local).AddTicks(933) });
        }
    }
}
