using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEP_JMS.Model.Migrations
{
    /// <inheritdoc />
    public partial class modify_rels_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_User_CompanyId",
                table: "User",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Price_JobTypeId",
                table: "Price",
                column: "JobTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Receiver",
                table: "Notification",
                column: "Receiver");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_TriggerBy",
                table: "Notification",
                column: "TriggerBy");

            migrationBuilder.CreateIndex(
                name: "IX_Job_AccountId",
                table: "Job",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Job_CreatedBy",
                table: "Job",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Job_CustomerId",
                table: "Job",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Job_DesignerId",
                table: "Job",
                column: "DesignerId");

            migrationBuilder.CreateIndex(
                name: "IX_Job_JobType",
                table: "Job",
                column: "JobType");

            migrationBuilder.CreateIndex(
                name: "IX_Company_AccountId",
                table: "Company",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_PriceGroupId",
                table: "Company",
                column: "PriceGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_CorrelationJobId",
                table: "Comment",
                column: "CorrelationJobId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_ReplyCommentId",
                table: "Comment",
                column: "ReplyCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Comment_ReplyCommentId",
                table: "Comment",
                column: "ReplyCommentId",
                principalTable: "Comment",
                principalColumn: "CommentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Job_CorrelationJobId",
                table: "Comment",
                column: "CorrelationJobId",
                principalTable: "Job",
                principalColumn: "JobId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_User_UserId",
                table: "Comment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_PriceGroup_PriceGroupId",
                table: "Company",
                column: "PriceGroupId",
                principalTable: "PriceGroup",
                principalColumn: "PriceGroupId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_User_AccountId",
                table: "Company",
                column: "AccountId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_Job_ParentId",
                table: "Job",
                column: "ParentId",
                principalTable: "Job",
                principalColumn: "JobId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_TypeOfJob_JobType",
                table: "Job",
                column: "JobType",
                principalTable: "TypeOfJob",
                principalColumn: "TypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_User_AccountId",
                table: "Job",
                column: "AccountId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_User_CreatedBy",
                table: "Job",
                column: "CreatedBy",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_User_CustomerId",
                table: "Job",
                column: "CustomerId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Job_User_DesignerId",
                table: "Job",
                column: "DesignerId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_User_Receiver",
                table: "Notification",
                column: "Receiver",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_User_TriggerBy",
                table: "Notification",
                column: "TriggerBy",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Price_PriceGroup_PriceGroupId",
                table: "Price",
                column: "PriceGroupId",
                principalTable: "PriceGroup",
                principalColumn: "PriceGroupId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Price_TypeOfJob_JobTypeId",
                table: "Price",
                column: "JobTypeId",
                principalTable: "TypeOfJob",
                principalColumn: "TypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Company_CompanyId",
                table: "User",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "CompanyId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Comment_ReplyCommentId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Job_CorrelationJobId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Comment_User_UserId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_PriceGroup_PriceGroupId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_User_AccountId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_Job_ParentId",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_TypeOfJob_JobType",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_User_AccountId",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_User_CreatedBy",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_User_CustomerId",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Job_User_DesignerId",
                table: "Job");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_User_Receiver",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_User_TriggerBy",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Price_PriceGroup_PriceGroupId",
                table: "Price");

            migrationBuilder.DropForeignKey(
                name: "FK_Price_TypeOfJob_JobTypeId",
                table: "Price");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Company_CompanyId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_CompanyId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Price_JobTypeId",
                table: "Price");

            migrationBuilder.DropIndex(
                name: "IX_Notification_Receiver",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_TriggerBy",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Job_AccountId",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_CreatedBy",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_CustomerId",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_DesignerId",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_JobType",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Company_AccountId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_PriceGroupId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Comment_CorrelationJobId",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_ReplyCommentId",
                table: "Comment");
        }
    }
}
