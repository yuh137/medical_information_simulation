using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class Useonetabletosavereportsforbothstudentsandfaculty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminAnalyteReports_AdminQCLots_AdminQCLotID",
                table: "AdminAnalyteReports");

            migrationBuilder.DropForeignKey(
                name: "FK_AdminAnalyteReports_Admins_AdminID",
                table: "AdminAnalyteReports");

            migrationBuilder.DropIndex(
                name: "IX_AdminAnalyteReports_AdminID",
                table: "AdminAnalyteReports");

            migrationBuilder.DropIndex(
                name: "IX_AdminAnalyteReports_AdminQCLotID",
                table: "AdminAnalyteReports");

            migrationBuilder.AlterColumn<Guid>(
                name: "StudentID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2025, 2, 13, 10, 50, 58, 166, DateTimeKind.Local).AddTicks(9982), new DateTime(2025, 2, 13, 10, 50, 58, 167, DateTimeKind.Local).AddTicks(5) });

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_AdminID",
                table: "StudentReports",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_Admins_AdminID",
                table: "StudentReports",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_Admins_AdminID",
                table: "StudentReports");

            migrationBuilder.DropIndex(
                name: "IX_StudentReports_AdminID",
                table: "StudentReports");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "StudentReports");

            migrationBuilder.AlterColumn<Guid>(
                name: "StudentID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 11, 5, 22, 5, 12, 313, DateTimeKind.Local).AddTicks(505), new DateTime(2024, 11, 5, 22, 5, 12, 313, DateTimeKind.Local).AddTicks(519) });

            migrationBuilder.CreateIndex(
                name: "IX_AdminAnalyteReports_AdminID",
                table: "AdminAnalyteReports",
                column: "AdminID");

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

            migrationBuilder.AddForeignKey(
                name: "FK_AdminAnalyteReports_Admins_AdminID",
                table: "AdminAnalyteReports",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
