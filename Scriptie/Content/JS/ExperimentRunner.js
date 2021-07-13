
I.Experiment = function () {
};

I.Experiment.prototype = (function () {

    return {
    };
})();

var defaultSettings = [{
    name: "(1 + 1)",
    algorithm: "(1 + 1)",
    acceptCriteria: 0.995,
    mutationStrength: 120
}, {
    name: "SA",
    algorithm: "Simulated Annealing",
    acceptCriteria: 0.995,
    mutationStrength: 120,
    T: 1000,
    T_min: 0.1,
    alpha: 0.95
}, {
    name: "PSO",
    algorithm: "Particle Swarm Optimization",
    acceptCriteria: 0.995,
    populationSize: 400,
    initialVelocity: 16,
    r1: 1.75,
    r2: 2,
    r3: 2.25
}, {
    name: "ASO",
    algorithm: "Adaptive Structure Optimization",
    enableInfections: false,
    acceptCriteria: 0.995,
    mutationStrength: 120
}, {
    name: "ASO - With propagation",
    algorithm: "Adaptive Structure Optimization",
    enableInfections: true,
    acceptCriteria: 0.995,
    mutationStrength: 120,
    infectionRate: 0.4
}
];

I.ExperimentRunner = function () {
    this.isRunning = false;

    this.settingsButton = I.NB("#BtnFullExpirementSettings");

    this.settingsButton.execute(this.openSettings, this);

    this.button = I.NB("#BtnRunFullExpirement");

    this.button.execute(this.run, this);

    var formData = {
        noButtonsRow: true,
        fields: [
            {
                name: "AlgorithmSettings",
                title: "Settings",
                control: "AceEditor",
                options: {
                    classes: "AlgorithmSettingsAce",
                    mode: "ace/mode/json"
                }
            }
        ]
    };

    this.settingsContent = I("<div></div>");

    this.webForm = I.CreateForm(this.settingsContent, formData);

    this.algorithmSettings = this.webForm.elements.AlgorithmSettings;

    this.webForm.elements.AlgorithmSettings.value(JSON.stringify(defaultSettings, null, '\t'));
};

I.ExperimentRunner.prototype = (function () {
    var config, scriptie, iterations;

    return {
        run: function () {
            if (!this.isRunning) {
                scriptie = I.Scriptie_New.current;
                config = I.Scriptie_New.config;

                iterations = config.txtIterations.number();

                this.isRunning = true;

                this.runNumber = 0;

                this.button.startProcessing();

                this.experimentSettings = JSON.parse(this.algorithmSettings.value());

                var message = new I.Message("Scriptie/AddExperiment",
                    {
                        experiment: {
                            MaxConfigurations: config.txtConfigs.number(),
                            NumShapes: config.txtAddMultiple.number(),
                            OverlapWeight: config.txtOverlapWeight.number(),
                            DisplacementWeight: config.txtDisplacementWeight.number()
                        }
                    },
                    function (reply) {
                        if (!reply.error) {
                            this.experiment = reply;

                            this.exWin = I.data.openExperimentWindow(reply.Id);

                            this.processNextRun();
                        }
                    }, this);
                message.send();
            }
        },
        processNextRun: function () {
            if (this.thisRun == null || this.thisRun.iteration >= iterations) {
                if (this.runNumber >= this.experimentSettings.length) {
                    this.end();
                    return;
                }

                this.thisRun = this.experimentSettings[this.runNumber++];
                this.thisRun.iteration = 1;
                this.thisRun.Id = null;
            } else {
                this.thisRun.iteration++;
            }

            if (this.thisRun.algorithm === "(1 + 1)")
                config.rbl.value(0);
            else if (this.thisRun.algorithm === "Simulated Annealing")
                config.rbl.value(1);
            else if (this.thisRun.algorithm === "Particle Swarm Optimization")
                config.rbl.value(2);
            else if (this.thisRun.algorithm === "Adaptive Structure Optimization")
                config.rbl.value(3);
            else {
                I.toaster.error("Algorithm not found: " + this.thisRun.algorithm);
                this.end();
                return;
            }

            scriptie.addMultiple({
                settings: this.thisRun,
                callback: this.runReturn,
                scope: this
            });
        },
        runReturn: function (runConfig, results) {
            if (runConfig.settings.Id == null) {
                var message = new I.Message("Scriptie/AddRun",
                    {
                        run: {
                            ExperimentId: this.experiment.Id,
                            Name: runConfig.settings.name,
                            Algorithm: runConfig.settings.algorithm,
                            Settings: JSON.stringify(runConfig.settings, null, '\t')
                        }
                    },
                    function (reply) {
                        if (!reply.error) {
                            runConfig.Id = reply.Id;
                            runConfig.settings.Id = reply.Id;
                            this.addResults(runConfig, results);
                        }
                    },
                    this);

                message.send();
            } else {
                runConfig.Id = runConfig.settings.Id;
                this.addResults(runConfig, results);
            }
        },
        addResults: function (runConfig, results) {
            var resultsArr = [];

            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                resultsArr.push({
                    ExperimentId: this.experiment.Id,
                    RunId: runConfig.Id,
                    Iteration: runConfig.settings.iteration,
                    ShapeNumber: result.N,
                    Time: result.Time,
                    DisplacementGrade: result.DisplacementGrade,
                    OverlapGrade: result.OverlapGrade,
                    OverallGrade: result.OverallGrade
                });
            }

            var message = new I.Message("Scriptie/AddResults",
                {
                    results: resultsArr
                },
                function (reply) {
                    if (!reply.error) {
                        runConfig.win.close();

                        this.exWin.exTable.refresh();

                        this.processNextRun();
                    }
                }, this);
            message.send();
        },
        end: function () {
            this.isRunning = false;
            this.button.endProcessing();
            I.toaster.success("Experiment completed.");
        },
        openSettings: function () {
            if (this.settingsWin == null || this.settingsWin.isDeactivated()) {
                this.settingsWin = I.Window.create({
                    board: I.board,
                    size: 1,
                    title: "Algorithm Settings",
                    pos: "rightFromMiddleOpen",
                    scroll: "none",
                    content: this.settingsContent
                });
            } else {
                this.settingsWin.showSelect();
            }
        }
    };
})();

