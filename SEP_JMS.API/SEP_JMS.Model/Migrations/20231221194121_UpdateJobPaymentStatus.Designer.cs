﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SEP_JMS.Model.Models;

#nullable disable

namespace SEP_JMS.Model.Migrations
{
    [DbContext(typeof(JSMContext))]
    [Migration("20231221194121_UpdateJobPaymentStatus")]
    partial class UpdateJobPaymentStatus
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SEP_JMS.Model.Models.Comment", b =>
                {
                    b.Property<Guid>("CommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Attachments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CommentStatus")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("CorrelationJobId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<Guid?>("ReplyCommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("VisibleType")
                        .HasColumnType("int");

                    b.HasKey("CommentId");

                    b.HasIndex("CorrelationJobId");

                    b.HasIndex("ReplyCommentId");

                    b.HasIndex(new[] { "UserId", "CorrelationJobId", "CreatedTime" }, "Comment_Query_Index")
                        .IsDescending();

                    b.ToTable("Comment", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Company", b =>
                {
                    b.Property<Guid>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AccountId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CompanyAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CompanyStatus")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("PriceGroupId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("CompanyId");

                    b.HasIndex("AccountId");

                    b.HasIndex("PriceGroupId");

                    b.ToTable("Company", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Job", b =>
                {
                    b.Property<Guid>("JobId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AccountId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("CorrelationType")
                        .HasColumnType("int");

                    b.Property<Guid>("CreatedBy")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<Guid>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("Deadline")
                        .HasColumnType("bigint");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("DesignerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("FinalJobType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FinalLink")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FinalPreview")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FinalProducts")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FinalUnitPrice")
                        .HasColumnType("int");

                    b.Property<int>("InternalJobStatus")
                        .HasColumnType("int");

                    b.Property<long>("InternalLastUpdated")
                        .HasColumnType("bigint");

                    b.Property<int>("JobStatus")
                        .HasColumnType("int");

                    b.Property<Guid>("JobType")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("LastUpdated")
                        .HasColumnType("bigint");

                    b.Property<Guid?>("ParentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("PaymentSuccess")
                        .HasColumnType("bit");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<string>("Requirements")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("JobId");

                    b.HasIndex("AccountId");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("CustomerId");

                    b.HasIndex("DesignerId");

                    b.HasIndex("JobType");

                    b.HasIndex(new[] { "ParentId", "CustomerId", "AccountId", "CreatedBy", "DesignerId", "CreatedTime" }, "Job_Query_Index")
                        .IsDescending();

                    b.ToTable("Job", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.JobType", b =>
                {
                    b.Property<Guid>("TypeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<string>("TypeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TypeId");

                    b.ToTable("TypeOfJob", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Notification", b =>
                {
                    b.Property<Guid>("NotificationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long?>("ArchivedAt")
                        .HasColumnType("bigint");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EntityIdentifier")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EntityName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("ReadAt")
                        .HasColumnType("bigint");

                    b.Property<Guid>("Receiver")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("TriggerBy")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("NotificationId");

                    b.HasIndex("Receiver");

                    b.HasIndex("TriggerBy");

                    b.ToTable("Notification", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Price", b =>
                {
                    b.Property<Guid>("PriceId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("JobTypeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("PriceGroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("UnitPrice")
                        .HasColumnType("int");

                    b.HasKey("PriceId");

                    b.HasIndex("JobTypeId");

                    b.HasIndex("PriceGroupId", "JobTypeId")
                        .IsUnique();

                    b.ToTable("Price", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.PriceGroup", b =>
                {
                    b.Property<Guid>("PriceGroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("PriceGroupId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("PriceGroup", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("AccountStatus")
                        .HasColumnType("int");

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("CreatedTime")
                        .HasColumnType("bigint");

                    b.Property<long?>("DOB")
                        .HasColumnType("bigint");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Fullname")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<bool>("HiddenPrice")
                        .HasColumnType("bit");

                    b.Property<string>("IDCardNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NotificationConfig")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("OffboardTime")
                        .HasColumnType("bigint");

                    b.Property<long?>("OnboardTime")
                        .HasColumnType("bigint");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleType")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId");

                    b.HasIndex("CompanyId");

                    b.HasIndex(new[] { "Email", "Fullname" }, "User_Query_Index");

                    b.HasIndex(new[] { "Username" }, "User_Username_Index")
                        .IsUnique();

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Comment", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.Job", "Job")
                        .WithMany()
                        .HasForeignKey("CorrelationJobId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.Comment", "ReplyComment")
                        .WithMany()
                        .HasForeignKey("ReplyCommentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("SEP_JMS.Model.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Job");

                    b.Navigation("ReplyComment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Company", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.User", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.PriceGroup", "PriceGroup")
                        .WithMany()
                        .HasForeignKey("PriceGroupId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("PriceGroup");
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Job", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.User", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.User", "UserCreated")
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.User", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.User", "Designer")
                        .WithMany()
                        .HasForeignKey("DesignerId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("SEP_JMS.Model.Models.JobType", "TypeOfJob")
                        .WithMany()
                        .HasForeignKey("JobType")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.Job", "Parent")
                        .WithMany()
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Account");

                    b.Navigation("Customer");

                    b.Navigation("Designer");

                    b.Navigation("Parent");

                    b.Navigation("TypeOfJob");

                    b.Navigation("UserCreated");
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Notification", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.User", "UserReceiver")
                        .WithMany()
                        .HasForeignKey("Receiver")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.User", "UserTrigger")
                        .WithMany()
                        .HasForeignKey("TriggerBy")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserReceiver");

                    b.Navigation("UserTrigger");
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.Price", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.JobType", "JobType")
                        .WithMany()
                        .HasForeignKey("JobTypeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SEP_JMS.Model.Models.PriceGroup", "PriceGroup")
                        .WithMany()
                        .HasForeignKey("PriceGroupId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("JobType");

                    b.Navigation("PriceGroup");
                });

            modelBuilder.Entity("SEP_JMS.Model.Models.User", b =>
                {
                    b.HasOne("SEP_JMS.Model.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Company");
                });
#pragma warning restore 612, 618
        }
    }
}
