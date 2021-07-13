using Sysmo;
using Sysmo.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Scriptie
{
    public static class Thesis_Config
    {
        public static ConfigValue<string> Thesis_Database = new ConfigValue<string>("Thesis_Database", @"");
    }
}