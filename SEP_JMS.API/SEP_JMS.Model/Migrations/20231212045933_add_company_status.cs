using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEP_JMS.Model.Migrations
{
    /// <inheritdoc />
    public partial class add_company_status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Company",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Company");
        }
    }
}
