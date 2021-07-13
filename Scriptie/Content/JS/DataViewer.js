
I.DataViewer = function () {
};

I.DataViewer.prototype = (function () {

    return {
        openExperimentWindow: function (id) {
            var content = I("<div style='display:none'></div>");

            I.body.append(content);

            var exTable = I.createTable(content, {
                controller: "Scriptie",
                objectName: "Run",
                objectAlias: "Runs",
                hiddenColumns: ["ExperimentId"],
                enableQueryBuilder: false,
                enableSearch: false,
                deleteDisabled: false,
                editDisabled: false,
                enableAdd: false,
                useNewOptionsLoader: true,
                parameters: [{
                    column: "ExperimentId",
                    operation: 0,
                    value: id
                }],
                clickFunction: function (item) {
                    I.data.openResultsWindow(item.Id);
                }
            });

            var exWin = I.Window.create({
                board: I.board,
                width: 680,
                height: 620,
                size: 1,
                title: "Experiment: " + id,
                pos: "leftFromMiddleOpen",
                scroll: "auto",
                content: content
            });

            var downloadBtn = I.NiceButton.create({
                label: "<i class='fas fa-file-download' style='margin-right: 3px'></i> Download LaTeX",
                classes: "downloadBtn"
            });

            downloadBtn.click(function() {
                var message = new I.Message("Scriptie/DownloadExperiment",
                    {
                        id: id
                    },
                    function (reply) {
                        if (!reply.error) {
                            
                        }
                    }, this);
                message.timeoutMs = 18000000;
                message.responseType = 'blob';
                message.send();
            });

            content.prepend(downloadBtn);

            content.show();

            exWin.exTable = exTable;

            return exWin;
        },
        openResultsWindow: function(runId) {
            var content = I("<div style='display:none'></div>");

            I.body.append(content);

            var exTable = I.createTable(content, {
                controller: "Scriptie",
                objectName: "Result",
                objectAlias: "Results",
                hiddenColumns: ["RunId", "ExperimentId"],
                enableQueryBuilder: false,
                enableSearch: false,
                deleteDisabled: false,
                editDisabled: false,
                enableAdd: false,
                useNewOptionsLoader: true,
                parameters: [{
                    column: "RunId",
                    operation: 0,
                    value: runId
                }],
                clickFunction: function (item) {
                    console.log(item);
                }
            });

            var exWin = I.Window.create({
                board: I.board,
                size: 1,
                title: "Run: " + runId,
                pos: "middleOpen",
                scroll: "auto",
                content: content,
                width: 760,
                height: 500
            });

            content.show();


            exWin.exTable = exTable;

            return exWin;
        }
    };
})();