using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class AnalyteInputCommentFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "StudentReports");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "AnalyteInputs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "AnalyteInputs");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "StudentReports",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
