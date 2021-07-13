using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Sysmo;

namespace Scriptie.Source
{
    public class DataModelToLatex
    {


        public static StringBuilder ToLatexString<T>(IList<T> modelList, bool removeLineBreaks = false, StringBuilder csv = null)
            where T : IModel
        {
            if (modelList == null || modelList.Count == 0)
                return null;

            var model = modelList[0];

            var descriptor = model.GetDescriptor();

            return ToLatexStringInner(descriptor, modelList, removeLineBreaks, csv);
        }

        public static StringBuilder ToLatexStringInner(IModelDescriptor descriptor, IEnumerable modelList, bool removeLineBreaks = false, StringBuilder latex = null)
        {
            if (latex == null)
                latex = new StringBuilder();

            latex.AppendLine("\\begin{center}");
            latex.AppendLine("\\begin{table}");
            latex.AppendLine("\\begin{center}");
            latex.Append("\\begin{tabular}{|");

            bool isFirst = true;
            var properties = descriptor.Elements;

            foreach (var element in properties)
            {
                if (element.ContractOptional)
                    continue;

                if (!isFirst)
                {
                    latex.Append(" ");
                }
                else
                {
                    isFirst = false;
                }

                if (element.Name == "Settings")
                    continue;

                latex.Append("c");
            }
            
            latex.RemoveLastChar();
            latex.Append("|}\n");
            latex.AppendLine("\\hline");

            isFirst = true;

            foreach (var element in properties)
            {
                if (element.ContractOptional)
                    continue;

                if (!isFirst)
                {
                    latex.Append(" & ");
                }
                else
                {
                    isFirst = false;
                }

                if (element.Name == "Settings")
                    continue;

                latex.Append(element.ContractName);
            }

            latex.RemoveLastChar();
            latex.RemoveLastChar();
            latex.RemoveLastChar();
            latex.Append(" \\\\ [0.5ex] \n");
            latex.AppendLine("\\hline\\hline");

            foreach (var model in modelList)
            {
                isFirst = true;

                for (int i = 0; i < properties.Count; i++)
                {
                    var element = properties[i];

                    if (element.ContractOptional)
                        continue;

                    if (!isFirst)
                    {
                        latex.Append(" & ");
                    }
                    else
                    {
                        isFirst = false;
                    }
                    
                    if (element.Name == "Settings")
                        continue;

                    var value = element.GetValue(model);

                    if (element.ContractName == "Algorithm")
                    {
                        if ((string)value == "Simulated Annealing")
                            value = "SA";
                        else if ((string)value == "Particle Swarm Optimization")
                            value = "PSO";
                        else if ((string)value == "Adaptive Structure Optimization")
                            value = "ASO";
                    }

                    latex.Append(value);
                }

                latex.RemoveLastChar();
                latex.RemoveLastChar();
                latex.RemoveLastChar();
                latex.AppendLine(" \\\\");
                latex.AppendLine("\\hline");
            }

            string title = "";

            foreach (var model in modelList)
            {
                for (int i = 0; i < properties.Count; i++)
                {
                    var element = properties[i];

                    if (element.Name == "ExperimentId")
                    {
                        var value = element.GetValue(model);
                        title = "Experiment " + value;
                        break;
                    }
                }

                break;
            }

            latex.AppendLine("\\end{tabular}");
            latex.AppendLine("\\end{center}");
            latex.AppendLine("\\caption{" + title + "}");
            latex.AppendLine("\\label{table:" + title + "}");
            latex.AppendLine("\\end{table}");
            latex.AppendLine("\\end{center}");

            return latex;
        }

        public static byte[] Convert<T>(IList<T> modelList, bool removeLineBreaks = false)
            where T : IModel
        {
            var latex = ToLatexString<T>(modelList, removeLineBreaks);

            return Encoding.UTF8.GetBytes(latex.ToString());
        }
    }
}