using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sysmo;
using Sysmo.Storage;

namespace Scriptie
{
    [StorageTable("Experiments")]
    public class Experiment : StorageTable<Experiment>
    {
        [PrimaryKey]
        [IdentityColumn]
        [ContractName("Id")]
        [Column("Id")]
        public int Id { get; set; }

        [ContractName("Name")]
        [Column("Name")]
        public string Name { get; set; }

        [ContractName("DateTime")]
        [Column("DateTime")]
        public DateTime DateTime { get; set; }

        [ContractName("NumShapes")]
        [Column("NumShapes")]
        public int NumShapes { get; set; }

        [ContractName("MaxConfigurations")]
        [Column("MaxConfigurations")]
        public int MaxConfigurations { get; set; }

        [ContractName("OverlapWeight")]
        [Column("OverlapWeight")]
        public int OverlapWeight { get; set; }

        [ContractName("DisplacementWeight")]
        [Column("DisplacementWeight")]
        public int DisplacementWeight { get; set; }
    }
}