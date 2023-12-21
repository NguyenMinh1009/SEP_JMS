using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEP_JMS.Model.Migrations
{
    /// <inheritdoc />
    public partial class UpdateJobPaymentStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinalJobType",
                table: "Job",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinalUnitPrice",
                table: "Job",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PaymentSuccess",
                table: "Job",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalJobType",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "FinalUnitPrice",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "PaymentSuccess",
                table: "Job");
        }
    }
}
