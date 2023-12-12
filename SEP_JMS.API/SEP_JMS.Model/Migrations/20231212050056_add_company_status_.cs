using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEP_JMS.Model.Migrations
{
    /// <inheritdoc />
    public partial class add_company_status_ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Company",
                newName: "CompanyStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CompanyStatus",
                table: "Company",
                newName: "Status");
        }
    }
}
