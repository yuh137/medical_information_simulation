using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class restructureAdminQCLotsintoAdminQCTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnalyteInputs_AdminAnalyteReports_AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropForeignKey(
                name: "FK_Analytes_AdminQCLots_AdminQCLotID",
                table: "Analytes");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_AdminQCLots_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropTable(
                name: "AdminAnalyteReports");

            migrationBuilder.DropIndex(
                name: "IX_AnalyteInputs_AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdminQCLots",
                table: "AdminQCLots");

            migrationBuilder.DropIndex(
                name: "IX_AdminQCLots_LotNumber",
                table: "AdminQCLots");

            migrationBuilder.DropColumn(
                name: "AdminAnalyteReportReportID",
                table: "AnalyteInputs");

            migrationBuilder.RenameTable(
                name: "AdminQCLots",
                newName: "AdminQCTemplates");

            migrationBuilder.AlterColumn<string>(
                name: "QCName",
                table: "AdminQCTemplates",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "OpenDate",
                table: "AdminQCTemplates",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "LotNumber",
                table: "AdminQCTemplates",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "AdminQCTemplates",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpirationDate",
                table: "AdminQCTemplates",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            //migrationBuilder.AddColumn<string>(
            //    name: "TemplateType",
            //    table: "AdminQCTemplates",
            //    type: "nvarchar(8)",
            //    maxLength: 8,
            //    nullable: false,
            //    defaultValue: "Lot");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdminQCTemplates",
                table: "AdminQCTemplates",
                column: "AdminQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_AdminQCTemplates_LotNumber",
                table: "AdminQCTemplates",
                column: "LotNumber",
                unique: true,
                filter: "[LotNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AdminQCTemplates_QCName",
                table: "AdminQCTemplates",
                column: "QCName",
                unique: true,
                filter: "[TemplateType] = 'Template'");

            migrationBuilder.AddForeignKey(
                name: "FK_Analytes_AdminQCTemplates_AdminQCLotID",
                table: "Analytes",
                column: "AdminQCLotID",
                principalTable: "AdminQCTemplates",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_AdminQCTemplates_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID",
                principalTable: "AdminQCTemplates",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytes_AdminQCTemplates_AdminQCLotID",
                table: "Analytes");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_AdminQCTemplates_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdminQCTemplates",
                table: "AdminQCTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AdminQCTemplates_LotNumber",
                table: "AdminQCTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AdminQCTemplates_QCName",
                table: "AdminQCTemplates");

            migrationBuilder.DropColumn(
                name: "TemplateType",
                table: "AdminQCTemplates");

            migrationBuilder.RenameTable(
                name: "AdminQCTemplates",
                newName: "AdminQCLots");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "QCName",
                table: "AdminQCLots",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "OpenDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LotNumber",
                table: "AdminQCLots",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "AdminQCLots",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpirationDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdminQCLots",
                table: "AdminQCLots",
                column: "AdminQCLotID");

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
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnalyteInputs_AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                column: "AdminAnalyteReportReportID");

            migrationBuilder.CreateIndex(
                name: "IX_AdminQCLots_LotNumber",
                table: "AdminQCLots",
                column: "LotNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AnalyteInputs_AdminAnalyteReports_AdminAnalyteReportReportID",
                table: "AnalyteInputs",
                column: "AdminAnalyteReportReportID",
                principalTable: "AdminAnalyteReports",
                principalColumn: "ReportID");

            migrationBuilder.AddForeignKey(
                name: "FK_Analytes_AdminQCLots_AdminQCLotID",
                table: "Analytes",
                column: "AdminQCLotID",
                principalTable: "AdminQCLots",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_AdminQCLots_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID",
                principalTable: "AdminQCLots",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
