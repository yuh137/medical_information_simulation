using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Admins_AdminID",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_AdminID",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Students",
                newName: "Email");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FileDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "AdminStudent",
                columns: table => new
                {
                    AdminsAdminID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentsStudentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminStudent", x => new { x.AdminsAdminID, x.StudentsStudentID });
                    table.ForeignKey(
                        name: "FK_AdminStudent_Admins_AdminsAdminID",
                        column: x => x.AdminsAdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdminStudent_Students_StudentsStudentID",
                        column: x => x.StudentsStudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { null, new DateTime(2024, 9, 11, 1, 25, 38, 718, DateTimeKind.Local).AddTicks(8349) });

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyteInputs_ReportID",
                table: "AnalyteInputs",
                column: "ReportID");

            migrationBuilder.CreateIndex(
                name: "IX_AdminStudent_StudentsStudentID",
                table: "AdminStudent",
                column: "StudentsStudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_AnalyteInputs_StudentReports_ReportID",
                table: "AnalyteInputs",
                column: "ReportID",
                principalTable: "StudentReports",
                principalColumn: "ReportID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentReports_AdminQCLots_AdminQCLotID",
                table: "StudentReports",
                column: "AdminQCLotID",
                principalTable: "AdminQCLots",
                principalColumn: "AdminQCLotID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnalyteInputs_StudentReports_ReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentReports_AdminQCLots_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropTable(
                name: "AdminStudent");

            migrationBuilder.DropIndex(
                name: "IX_StudentReports_AdminQCLotID",
                table: "StudentReports");

            migrationBuilder.DropIndex(
                name: "IX_AnalyteInputs_ReportID",
                table: "AnalyteInputs");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Admins");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Students",
                newName: "Password");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminID",
                table: "Students",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "FileDate",
                table: "AdminQCLots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "FileDate", "OpenDate" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 9, 7, 18, 1, 46, 567, DateTimeKind.Local).AddTicks(7341) });

            migrationBuilder.CreateIndex(
                name: "IX_Students_AdminID",
                table: "Students",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Admins_AdminID",
                table: "Students",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID");
        }
    }
}
