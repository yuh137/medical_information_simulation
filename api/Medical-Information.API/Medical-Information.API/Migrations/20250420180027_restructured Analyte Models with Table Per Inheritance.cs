using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class restructuredAnalyteModelswithTablePerInheritance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytes_AdminQCTemplates_AdminQCLotID",
                table: "Analytes");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_AdminQCTemplates_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Analytes",
                table: "Analytes");

            migrationBuilder.RenameTable(
                name: "Analytes",
                newName: "AnalyteTemplates");

            migrationBuilder.RenameIndex(
                name: "IX_Analytes_AdminQCLotID",
                table: "AnalyteTemplates",
                newName: "IX_AnalyteTemplates_AdminQCLotID");

            migrationBuilder.AlterColumn<Guid>(
                name: "AdminQCLotID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "UnitOfMeasure",
                table: "AnalyteTemplates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<float>(
                name: "StdDevi",
                table: "AnalyteTemplates",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<float>(
                name: "MinLevel",
                table: "AnalyteTemplates",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<float>(
                name: "Mean",
                table: "AnalyteTemplates",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<float>(
                name: "MaxLevel",
                table: "AnalyteTemplates",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<Guid>(
                name: "AdminQCLotID",
                table: "AnalyteTemplates",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminQCTemplateID",
                table: "AnalyteTemplates",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AnalyteTemplates",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "Analyte");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AnalyteTemplates",
                table: "AnalyteTemplates",
                column: "AnalyteID");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyteTemplates_AdminQCTemplateID",
                table: "AnalyteTemplates",
                column: "AdminQCTemplateID");

            migrationBuilder.AddForeignKey(
                name: "FK_AnalyteTemplates_AdminQCTemplates_AdminQCLotID",
                table: "AnalyteTemplates",
                column: "AdminQCLotID",
                principalTable: "AdminQCTemplates",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AnalyteTemplates_AdminQCTemplates_AdminQCTemplateID",
                table: "AnalyteTemplates",
                column: "AdminQCTemplateID",
                principalTable: "AdminQCTemplates",
                principalColumn: "AdminQCLotID");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_AdminQCTemplates_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID",
                principalTable: "AdminQCTemplates",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnalyteTemplates_AdminQCTemplates_AdminQCLotID",
                table: "AnalyteTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_AnalyteTemplates_AdminQCTemplates_AdminQCTemplateID",
                table: "AnalyteTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_AdminQCTemplates_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AnalyteTemplates",
                table: "AnalyteTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AnalyteTemplates_AdminQCTemplateID",
                table: "AnalyteTemplates");

            migrationBuilder.DropColumn(
                name: "AdminQCTemplateID",
                table: "AnalyteTemplates");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AnalyteTemplates");

            migrationBuilder.RenameTable(
                name: "AnalyteTemplates",
                newName: "Analytes");

            migrationBuilder.RenameIndex(
                name: "IX_AnalyteTemplates_AdminQCLotID",
                table: "Analytes",
                newName: "IX_Analytes_AdminQCLotID");

            migrationBuilder.AlterColumn<Guid>(
                name: "AdminQCLotID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UnitOfMeasure",
                table: "Analytes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "StdDevi",
                table: "Analytes",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "MinLevel",
                table: "Analytes",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Mean",
                table: "Analytes",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "MaxLevel",
                table: "Analytes",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "AdminQCLotID",
                table: "Analytes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Analytes",
                table: "Analytes",
                column: "AnalyteID");

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
    }
}
