using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Medical_Information.API.Migrations
{
    /// <inheritdoc />
    public partial class Seeddataagain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AdminQCLots",
                columns: new[] { "AdminQCLotID", "ClosedDate", "Department", "LotNumber", "OpenDate" },
                values: new object[] { new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), null, 0, "888888888888", new DateTime(2024, 5, 22, 17, 1, 22, 362, DateTimeKind.Local).AddTicks(6398) });

            migrationBuilder.InsertData(
                table: "Analytes",
                columns: new[] { "AnalyteID", "AdminQCLotID", "AnalyteAcronym", "AnalyteName", "Electrolyte", "MaxLevel", "Mean", "MinLevel", "StdDevi", "UnitOfMeasure" },
                values: new object[,]
                {
                    { new Guid("46baac82-7390-4139-b4ae-9c284de63860"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "Cl", "Chloride", true, 0f, 0f, 0f, 0f, "mEq/L" },
                    { new Guid("6a14f038-4f68-488a-93bb-0f1c9f33f09a"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "ALP", "Akaline Phosphatse", false, 0f, 0f, 0f, 0f, "U/L" },
                    { new Guid("6e52026c-5cc5-4175-b476-29a1f5bd4c02"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "CO_2", "Carbon Dioxide", true, 0f, 0f, 0f, 0f, "mEq/L" },
                    { new Guid("9cf3ff8a-208d-4b05-b108-3e4fb82f2b7f"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "AST", "Aspartate Aminotransferase", false, 0f, 0f, 0f, 0f, "U/L" },
                    { new Guid("9d5b1c89-7b7e-4c1f-b0c7-1d8b1d4f3587"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "BUN", "Blood Urea Nitrogen", false, 0f, 0f, 0f, 0f, "mg/dL" },
                    { new Guid("a50e49c0-c80d-4347-a2d4-186f22c7bb3f"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "ALB", "Albumin", false, 0f, 0f, 0f, 0f, "g/dL" },
                    { new Guid("b05e9c30-3f03-4fad-a703-ad532bd39ae5"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "Na", "Sodium", true, 0f, 0f, 0f, 0f, "mEq/L" },
                    { new Guid("b886f8d0-798d-4c0f-aa91-4e5b2f6f0a07"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "CA", "Calcium", false, 0f, 0f, 0f, 0f, "mg/dL" },
                    { new Guid("ce5ba2a7-6543-4f81-b906-64599b274f97"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "K", "Potassium", true, 0f, 0f, 0f, 0f, "mEq/L" },
                    { new Guid("d614a66d-fc2d-4518-bb0f-1787ed48f5c1"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "TP", "Total Protein", false, 0f, 0f, 0f, 0f, "mg/dL" },
                    { new Guid("e01c6f52-07ab-4995-88de-bb83072aef5a"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "CREA", "Creatinine", false, 0f, 0f, 0f, 0f, "mg/dL" },
                    { new Guid("e783a56d-5fc4-4a8e-8509-aa99b0e64b1c"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "BIL", "Bilirubin", false, 0f, 0f, 0f, 0f, "mg/dL" },
                    { new Guid("f3033c25-0d20-41db-89a9-69b6bb66f2d2"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "ALT", "Alanine Aminotransferase", false, 0f, 0f, 0f, 0f, "U/L" },
                    { new Guid("f5012c5e-4d05-46ff-b6fd-4c53789bafdb"), new Guid("bbb59aca-6c27-424c-852f-21656a88f449"), "GLU", "Glucose", false, 0f, 0f, 0f, 0f, "mg/dL" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("46baac82-7390-4139-b4ae-9c284de63860"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("6a14f038-4f68-488a-93bb-0f1c9f33f09a"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("6e52026c-5cc5-4175-b476-29a1f5bd4c02"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("9cf3ff8a-208d-4b05-b108-3e4fb82f2b7f"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("9d5b1c89-7b7e-4c1f-b0c7-1d8b1d4f3587"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("a50e49c0-c80d-4347-a2d4-186f22c7bb3f"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("b05e9c30-3f03-4fad-a703-ad532bd39ae5"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("b886f8d0-798d-4c0f-aa91-4e5b2f6f0a07"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("ce5ba2a7-6543-4f81-b906-64599b274f97"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("d614a66d-fc2d-4518-bb0f-1787ed48f5c1"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("e01c6f52-07ab-4995-88de-bb83072aef5a"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("e783a56d-5fc4-4a8e-8509-aa99b0e64b1c"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("f3033c25-0d20-41db-89a9-69b6bb66f2d2"));

            migrationBuilder.DeleteData(
                table: "Analytes",
                keyColumn: "AnalyteID",
                keyValue: new Guid("f5012c5e-4d05-46ff-b6fd-4c53789bafdb"));

            migrationBuilder.DeleteData(
                table: "AdminQCLots",
                keyColumn: "AdminQCLotID",
                keyValue: new Guid("bbb59aca-6c27-424c-852f-21656a88f449"));
        }
    }
}
