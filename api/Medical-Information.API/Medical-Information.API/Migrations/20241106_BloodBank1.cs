/*
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BloodBankQCLot",
                columns: table => new
                {
                    BloodBankQCLotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QCName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LotNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                    OpenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClosedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FileDate = table.Column<DateTime>(type: "datetime2", nullable: true),

                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BBQCLots", x => x.BloodBankQCLotID);
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
                    PosExpectedRange = table.Column<boolean>(type: "bit", nullable: false),
                    NegExpectedRange = table.Column<boolean>(type: "bit", nullable: false),
                    BloodBankQCLot = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
        }
    }
}

*/