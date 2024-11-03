using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class Addednewdataschema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Electrolyte",
                table: "Analytes");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminID",
                table: "Students",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Firstname",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Initials",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Firstname",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Initials",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FileDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "AnalyteInputs",
                columns: table => new
                {
                    AnalyteInputID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnalyteName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnalyteValue = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyteInputs", x => x.AnalyteInputID);
                });

            migrationBuilder.CreateTable(
                name: "StudentReports",
                columns: table => new
                {
                    ReportID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdminQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentReports", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_StudentReports_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 9, 5, 12, 54, 12, 760, DateTimeKind.Local).AddTicks(4946) });

            migrationBuilder.CreateIndex(
                name: "IX_Students_AdminID",
                table: "Students",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_StudentID",
                table: "StudentReports",
                column: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Admins_AdminID",
                table: "Students",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Admins_AdminID",
                table: "Students");

            migrationBuilder.DropTable(
                name: "AnalyteInputs");

            migrationBuilder.DropTable(
                name: "StudentReports");

            migrationBuilder.DropIndex(
                name: "IX_Students_AdminID",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Firstname",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Initials",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Firstname",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "Initials",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "AdminQCLots");

            migrationBuilder.DropColumn(
                name: "FileDate",
                table: "AdminQCLots");

            migrationBuilder.AddColumn<bool>(
                name: "Electrolyte",
                table: "Analytes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                column: "OpenDate",
                value: new DateTime(2024, 5, 22, 17, 1, 22, 362, DateTimeKind.Local).AddTicks(6398));

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("46baac82-7390-4139-b4ae-9c284de63860"),
                column: "Electrolyte",
                value: true);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("6a14f038-4f68-488a-93bb-0f1c9f33f09a"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("6e52026c-5cc5-4175-b476-29a1f5bd4c02"),
                column: "Electrolyte",
                value: true);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("9cf3ff8a-208d-4b05-b108-3e4fb82f2b7f"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("9d5b1c89-7b7e-4c1f-b0c7-1d8b1d4f3587"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("a50e49c0-c80d-4347-a2d4-186f22c7bb3f"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("b05e9c30-3f03-4fad-a703-ad532bd39ae5"),
                column: "Electrolyte",
                value: true);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("b886f8d0-798d-4c0f-aa91-4e5b2f6f0a07"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("ce5ba2a7-6543-4f81-b906-64599b274f97"),
                column: "Electrolyte",
                value: true);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("d614a66d-fc2d-4518-bb0f-1787ed48f5c1"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("e01c6f52-07ab-4995-88de-bb83072aef5a"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("e783a56d-5fc4-4a8e-8509-aa99b0e64b1c"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("f3033c25-0d20-41db-89a9-69b6bb66f2d2"),
                column: "Electrolyte",
                value: false);

            migrationBuilder.UpdateData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("f5012c5e-4d05-46ff-b6fd-4c53789bafdb"),
                column: "Electrolyte",
                value: false);
        }
    }
}
