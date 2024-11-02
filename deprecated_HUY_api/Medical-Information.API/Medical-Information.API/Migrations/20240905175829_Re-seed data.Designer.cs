﻿// <auto-generated />
using System;
using Medical_Information.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Medical_Information.API.Migrations
{
    [DbContext(typeof(MedicalInformationDbContext))]
    [Migration("20240905175829_Re-seed data")]
    partial class Reseeddata
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Admin", b =>
                {
                    b.Property<Guid>("AdminID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Firstname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Initials")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Lastname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AdminID");

                    b.ToTable("Admins");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.AdminQCLot", b =>
                {
                    b.Property<Guid>("AdminQCLotID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("ClosedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Department")
                        .HasColumnType("int");

                    b.Property<DateTime>("ExpirationDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("FileDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("LotNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("OpenDate")
                        .HasColumnType("datetime2");

                    b.HasKey("AdminQCLotID");

                    b.ToTable("AdminQCLots");

                    b.HasData(
                        new
                        {
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            Department = 0,
                            ExpirationDate = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            FileDate = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            LotNumber = "888888888888",
                            OpenDate = new DateTime(2024, 9, 5, 12, 58, 29, 405, DateTimeKind.Local).AddTicks(5530)
                        });
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Analyte", b =>
                {
                    b.Property<Guid>("AnalyteID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AdminQCLotID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AnalyteAcronym")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AnalyteName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("MaxLevel")
                        .HasColumnType("real");

                    b.Property<float>("Mean")
                        .HasColumnType("real");

                    b.Property<float>("MinLevel")
                        .HasColumnType("real");

                    b.Property<float>("StdDevi")
                        .HasColumnType("real");

                    b.Property<string>("UnitOfMeasure")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AnalyteID");

                    b.HasIndex("AdminQCLotID");

                    b.ToTable("Analytes");

                    b.HasData(
                        new
                        {
                            AnalyteID = new Guid("b05e9c30-3f03-4fad-a703-ad532bd39ae5"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "Na",
                            AnalyteName = "Sodium",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mEq/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("ce5ba2a7-6543-4f81-b906-64599b274f97"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "K",
                            AnalyteName = "Potassium",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mEq/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("46baac82-7390-4139-b4ae-9c284de63860"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "Cl",
                            AnalyteName = "Chloride",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mEq/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("6e52026c-5cc5-4175-b476-29a1f5bd4c02"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "CO_2",
                            AnalyteName = "Carbon Dioxide",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mEq/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("9d5b1c89-7b7e-4c1f-b0c7-1d8b1d4f3587"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "BUN",
                            AnalyteName = "Blood Urea Nitrogen",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("e01c6f52-07ab-4995-88de-bb83072aef5a"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "CREA",
                            AnalyteName = "Creatinine",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("b886f8d0-798d-4c0f-aa91-4e5b2f6f0a07"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "CA",
                            AnalyteName = "Calcium",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("f5012c5e-4d05-46ff-b6fd-4c53789bafdb"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "GLU",
                            AnalyteName = "Glucose",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("a50e49c0-c80d-4347-a2d4-186f22c7bb3f"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "ALB",
                            AnalyteName = "Albumin",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "g/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("f3033c25-0d20-41db-89a9-69b6bb66f2d2"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "ALT",
                            AnalyteName = "Alanine Aminotransferase",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "U/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("9cf3ff8a-208d-4b05-b108-3e4fb82f2b7f"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "AST",
                            AnalyteName = "Aspartate Aminotransferase",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "U/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("6a14f038-4f68-488a-93bb-0f1c9f33f09a"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "ALP",
                            AnalyteName = "Akaline Phosphatse",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "U/L"
                        },
                        new
                        {
                            AnalyteID = new Guid("e783a56d-5fc4-4a8e-8509-aa99b0e64b1c"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "BIL",
                            AnalyteName = "Bilirubin",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        },
                        new
                        {
                            AnalyteID = new Guid("d614a66d-fc2d-4518-bb0f-1787ed48f5c1"),
                            AdminQCLotID = new Guid("bbb59aca-6c27-424c-852f-21656a88f449"),
                            AnalyteAcronym = "TP",
                            AnalyteName = "Total Protein",
                            MaxLevel = 0f,
                            Mean = 0f,
                            MinLevel = 0f,
                            StdDevi = 0f,
                            UnitOfMeasure = "mg/dL"
                        });
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.AnalyteInput", b =>
                {
                    b.Property<Guid>("AnalyteInputID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AnalyteName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("AnalyteValue")
                        .HasColumnType("real");

                    b.Property<Guid>("ReportID")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("AnalyteInputID");

                    b.ToTable("AnalyteInputs");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Student", b =>
                {
                    b.Property<Guid>("StudentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("AdminID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Firstname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Initials")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Lastname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("StudentID");

                    b.HasIndex("AdminID");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.StudentReport", b =>
                {
                    b.Property<Guid>("ReportID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AdminQCLotID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("StudentID")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("ReportID");

                    b.HasIndex("StudentID");

                    b.ToTable("StudentReports");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Analyte", b =>
                {
                    b.HasOne("Medical_Information.API.Models.Domain.AdminQCLot", "AdminQCLot")
                        .WithMany("Analytes")
                        .HasForeignKey("AdminQCLotID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AdminQCLot");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Student", b =>
                {
                    b.HasOne("Medical_Information.API.Models.Domain.Admin", "Admin")
                        .WithMany("Students")
                        .HasForeignKey("AdminID");

                    b.Navigation("Admin");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.StudentReport", b =>
                {
                    b.HasOne("Medical_Information.API.Models.Domain.Student", null)
                        .WithMany("Reports")
                        .HasForeignKey("StudentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Admin", b =>
                {
                    b.Navigation("Students");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.AdminQCLot", b =>
                {
                    b.Navigation("Analytes");
                });

            modelBuilder.Entity("Medical_Information.API.Models.Domain.Student", b =>
                {
                    b.Navigation("Reports");
                });
#pragma warning restore 612, 618
        }
    }
}