using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReportstoAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AdminAnalyteReports",
                columns: table => new
                {
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdminID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminAnalyteReports", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_AdminAnalyteReports_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 16, 22, 54, 27, 685, DateTimeKind.Local).AddTicks(919), new DateTime(2024, 10, 16, 22, 54, 27, 685, DateTimeKind.Local).AddTicks(933) });

            migrationBuilder.CreateIndex(
                name: "IX_AnalyteInputs_AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                column: "AdminAnalyteReportReportID");

            migrationBuilder.CreateIndex(
                name: "IX_AdminAnalyteReports_AdminID",
                table: "AdminAnalyteReports",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_AnalyteInputs_AdminAnalyteReports_AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                column: "AdminAnalyteReportReportID",
                principalTable: "AdminAnalyteReports",
                principalColumn: "ReportID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnalyteInputs_AdminAnalyteReports_AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropTable(
                name: "AdminAnalyteReports");

            migrationBuilder.DropIndex(
                name: "IX_AnalyteInputs_AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropColumn(
                name: "AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 10, 4, 20, 54, 36, 769, DateTimeKind.Local).AddTicks(1986), new DateTime(2024, 10, 4, 20, 54, 36, 769, DateTimeKind.Local).AddTicks(2003) });
        }
    }
}
