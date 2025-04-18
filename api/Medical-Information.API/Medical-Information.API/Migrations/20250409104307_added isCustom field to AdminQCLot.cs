using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class addedisCustomfieldtoAdminQCLot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCustom",
                table: "AdminQCLots",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCustom",
                table: "AdminQCLots");
        }
    }
}
