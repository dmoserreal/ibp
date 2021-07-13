using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using CrystalDecisions.ReportAppServer.DataDefModel;
using ePEC.Source;
using Scriptie;
using Scriptie.Source;
using Sysmo;
using Sysmo.AccountProviders;
using Sysmo.Storage;
using Sysmo.Web;
using Sysmo.Web.Api;

namespace Scriptie
{
    public class ScriptieController : Controller<SessionData>
    {
        public void AddExperiment(Experiment experiment)
        {
            experiment.DateTime = DateTime.Now;

            experiment.Insert();

            experiment.Name = "FullRun_" + experiment.Id;

            experiment.Update();

            Result = experiment;
        }

        public void AddRun(Run run)
        {
            var result = run.Insert();

            if (!result.Success)
            {
                Result = result;
                return;
            }

            Result = run;
        }

        public void AddResults(List<ExperimentResult> results)
        {
            foreach (var dataresult in results)
            {
                var result = dataresult.Insert();

                if (!result.Success)
                {
                    Result = result;
                    return;
                }
            }

            CalculateRunStatistics(results[0].RunId);
        }

        private decimal FindAverageForIteration_Score(List<ExperimentResult> results, int iteration)
        {
            decimal count = 0;
            decimal totalScore = 0;

            foreach (var dataresult in results)
            {
                if (dataresult.Iteration == iteration)
                {
                    count++;

                    totalScore += dataresult.OverallGrade;
                }
            }

            return totalScore / count;
        }

        private decimal FindAverageForIteration_Time(List<ExperimentResult> results, int iteration)
        {
            decimal count = 0;
            decimal totalTime = 0;

            foreach (var dataresult in results)
            {
                if (dataresult.Iteration == iteration)
                {
                    count++;

                    totalTime += dataresult.Time;
                }
            }

            return totalTime / count;
        }

        private void CalculateRunStatistics(int runId)
        {
            List<ExperimentResult> results = ExperimentResult.SelectAll(new Query(new List<IStorageParameterWithValue>() {
                new StorageParameterWithValue<int>("RunId", runId)
            })).Output;

            decimal count = 0;
            decimal totalScore = 0, totalTime = 0;

            int highestIteration = 0;

            foreach (var dataresult in results)
            {
                count++;

                totalScore += dataresult.OverallGrade;
                totalTime += dataresult.Time;

                if (dataresult.Iteration > highestIteration)
                    highestIteration = dataresult.Iteration;
            }
            
            Run run = Run.Select(results[0].RunId).Output;
            run.AverageScore = totalScore / count;
            run.AverageTime = totalTime / count;

            decimal meanDistanceSum_score = 0, meanDistanceSum_time = 0;

            for (var i = 1; i <= highestIteration; i++)
            {
                decimal mean_score = FindAverageForIteration_Score(results, i);
                decimal distanceFromMean_score = Math.Abs(run.AverageScore - mean_score);
                meanDistanceSum_score += distanceFromMean_score * distanceFromMean_score;

                decimal mean_time = FindAverageForIteration_Time(results, i);
                decimal distanceFromMean_time = Math.Abs(run.AverageTime - mean_time);
                meanDistanceSum_time += distanceFromMean_time * distanceFromMean_time;
            }

            decimal stdv_score = (decimal)Math.Sqrt((double)meanDistanceSum_score / (double)highestIteration);
            decimal stdv_time = (decimal)Math.Sqrt((double)meanDistanceSum_time / (double)highestIteration);

            run.StandardDeviation_Score = stdv_score;
            run.StandardDeviation_Time = stdv_time;

            run.Update();
        }

        public void Experiments(ListQuery listQuery)
        {
            if (listQuery.OrderByColumn == null)
            {
                listQuery.OrderByColumn = "Id";
                listQuery.OrderDirection = true;
            }

            Result = Experiment.SelectAllData(listQuery);
        }

        public void Runs(ListQuery listQuery)
        {
            Result = Run.SelectAllData(listQuery);
        }

        public void Results(ListQuery listQuery)
        {
            Result = ExperimentResult.SelectAllData(listQuery);
        }

        public void DownloadExperiment(int id)
        {
            var q = new Query(new List<IStorageParameterWithValue>() {
                new StorageParameterWithValue<int>("ExperimentId", id)
            });

            var runs = Run.SelectAll(q).Output;

            var file = new ApiFile();
            file.Name = "Experiment - " + id + ".txt";
            file.ContentType = MimeTypes.PlainType;
            file.Blob = DataModelToLatex.Convert(runs);
            Response = new FileResponse(file);
        }

        public void DownloadExperiment2(int id)
        {
            var q = new Query(new List<IStorageParameterWithValue>() {
                new StorageParameterWithValue<int>("ExperimentId", id)
            });

            var runs = Run.SelectAll(q).Output;

            int headersPerRun = 3;

            var latex = new StringBuilder();

            int headerNumber = headersPerRun * runs.Count + 1;

            latex.AppendLine("\\begin{center}");
            latex.Append("\\begin{tabular}{|");

            for (var i = 0; i < headerNumber; i++)
            {
                if (i != 0)
                    latex.Append(' ');

                latex.Append('c');

                if (i != headerNumber - 1)
                    latex.Append(' ');
            }

            latex.Append("|}\n");
            latex.AppendLine("\\hline");

            latex.AppendLine("Shape Number & ");

            for (var i = 0; i < runs.Count; i++)
            {
                var run = runs[i];

                var name = run.Name;

                latex.Append(name + ": Time");
                latex.Append(" & ");
                latex.Append(name + ": Score");
                latex.Append(" & ");
            }

            latex.RemoveLastChar();
            latex.RemoveLastChar();
            latex.RemoveLastChar();
            latex.Append(" \\\\ [0.5ex] \n");
            latex.AppendLine("\\hline\\hline");

            //data

            latex.AppendLine("\\end{tabular}");
            latex.AppendLine("\\end{center}");

            var file = new ApiFile();
            file.Name = "Experiment - " + id + ".txt";
            file.ContentType = MimeTypes.PlainType;
            file.Blob = DataModelToLatex.Convert(runs);
            Response = new FileResponse(file);
        }
    }
}