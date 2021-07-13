using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sysmo;
using Sysmo.Storage;

namespace ePEC.Source
{
    [StorageTable("Runs")]
    public class Run : StorageTable<Run>
    {
        [PrimaryKey]
        [IdentityColumn]
        [ContractName("Id")]
        [Column("Id")]
        [Optional]
        public int Id { get; set; }

        [ContractName("ExperimentId")]
        [Column("ExperimentId")]
        [Optional]
        public int ExperimentId { get; set; }

        [ContractName("Name")]
        [Column("Name")]
        public string Name { get; set; }

        [ContractName("Algorithm")]
        [Column("Algorithm")]
        public string Algorithm { get; set; }

        [ContractName("AVG Score")]
        [Column("AverageScore")]
        public decimal AverageScore { get; set; }

        [ContractName("AVG Time")]
        [Column("AverageTime")]
        public decimal AverageTime { get; set; }

        [ContractName("STDEV Score")]
        [Column("StandardDeviation_Score")]
        public decimal StandardDeviation_Score { get; set; }

        [ContractName("STDEV Time")]
        [Column("StandardDeviation_Time")]
        public decimal StandardDeviation_Time { get; set; }

        [ContractName("Settings")]
        [Column("Settings")]
        public string Settings { get; set; }
    }
}