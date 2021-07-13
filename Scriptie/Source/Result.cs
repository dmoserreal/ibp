using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sysmo;
using Sysmo.Storage;

namespace ePEC.Source
{
    [StorageTable("Results")]
    public class ExperimentResult : StorageTable<ExperimentResult>
    {
        [PrimaryKey]
        [IdentityColumn]
        [ContractName("Id")]
        [Column("Id")]
        public int Id { get; set; }

        [ContractName("ExperimentId")]
        [Column("ExperimentId")]
        public int ExperimentId { get; set; }

        [ContractName("RunId")]
        [Column("RunId")]
        public int RunId { get; set; }

        [ContractName("Iteration")]
        [Column("Iteration")]
        public int Iteration { get; set; }

        [ContractName("ShapeNumber")]
        [Column("ShapeNumber")]
        public int ShapeNumber { get; set; }

        [ContractName("Time")]
        [Column("Time")]
        public decimal Time { get; set; }

        [ContractName("DisplacementGrade")]
        [Column("DisplacementGrade")]
        public decimal DisplacementGrade { get; set; }

        [ContractName("OverlapGrade")]
        [Column("OverlapGrade")]
        public decimal OverlapGrade { get; set; }

        [ContractName("OverallGrade")]
        [Column("OverallGrade")]
        public decimal OverallGrade { get; set; }
    }
}