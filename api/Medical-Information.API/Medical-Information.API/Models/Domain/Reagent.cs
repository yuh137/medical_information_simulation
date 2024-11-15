﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class Reagent
    {
        [Key]
        public Guid ReagentID { get; set; }
        public string ReagentName { get; set; }
        public string Abbreviation { get; set; }
        public string ReagentLotNum { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string? PosExpectedRange { get; set; }
        public string? NegExpectedRange { get; set; }
        public string? ImmediateSpin { get; set; }
        public string? ThirtySevenDegree { get; set; }
        public string? AHG { get; set; }
        public string? CheckCell { get; set; }
        [ForeignKey("BloodBankQCLotID")]
        public Guid BloodBankQCLotID { get; set; }
        //public AdminQCLot AdminQCLot { get; set; }
    }
}