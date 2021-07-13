window.activeViewLoader.events = {
    pagePreLoad: function (thisView) {
    },
    pageLoad: function (thisView) {
        App.pageLoaded("Data Viewer");

        I("#Board").hide();

        I.theme.changeBackgroundImage(255, 255, 255);

        I.createTable(I("#ExperimentsTable"), {
            controller: "Scriptie",
            objectName: "Experiment",
            objectAlias: "Experiments",
            hiddenColumns: ["Ids"],
            enableQueryBuilder: true,
            enableSearch: true,
            deleteDisabled: false,
            editDisabled: false,
            enableAdd: false,
            useNewOptionsLoader: true,
            clickFunction: function (item) {
                console.log(item);
                I.data.openExperimentWindow(item.Id);
            }
        });
    }
};