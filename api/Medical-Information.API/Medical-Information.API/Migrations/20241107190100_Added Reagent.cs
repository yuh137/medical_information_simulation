using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedReagent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BloodBankQCLotID",
                table: "StudentReports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BloodBankQCLots",
                columns: table => new
                {
                    BloodBankQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QCName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LotNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClosedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FileDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodBankQCLots", x => x.BloodBankQCLotID);
                });

            migrationBuilder.CreateTable(
                name: "Reagents",
                columns: table => new
                {
                    ReagentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReagentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Abbreviation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReagentLotNum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PosExpectedRange = table.Column<bool>(type: "bit", nullable: false),
                    NegExpectedRange = table.Column<bool>(type: "bit", nullable: false),
                    BloodBankQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reagents", x => x.ReagentID);
                    table.ForeignKey(
                        name: "FK_Reagents_BloodBankQCLots_BloodBankQCLotID",
                        column: x => x.BloodBankQCLotID,
                        principalTable: "BloodBankQCLots",
                        principalColumn: "BloodBankQCLotID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                columns: new[] { "ExpirationDate", "FileDate", "OpenDate" },
                values: new object[] { new DateTime(2024, 12, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6035), new DateTime(2024, 11, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6042), new DateTime(2024, 11, 7, 13, 0, 59, 392, DateTimeKind.Local).AddTicks(6064) });

            migrationBuilder.CreateIndex(
                name: "IX_StudentReports_BloodBankQCLotID",
                table: "StudentReports",
                column: "BloodBankQCLotID");

            migrationBuilder.CreateIndex(
                name: "IX_Reagents_BloodBankQCLotID",
                table: "Reagents",
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

            migrationBuilder.DropTable(
                name: "Reagents");

            migrationBuilder.DropTable(
                name: "BloodBankQCLots");

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
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(2024, 9, 11, 1, 25, 38, 718, DateTimeKind.Local).AddTicks(8349) });
        }
    }
}
