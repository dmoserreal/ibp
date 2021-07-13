
window.activeViewLoader.events = {
    pagePreLoad: function (thisView) {
        I.App.setup({
            navigationBar: true,
            navigationBarOptions: { indicatorFloaterEnabled: true },
            sideMenu: false,
            versionInformation: "#VersionInformationHolder",
            isAdminFunction: function () {
                return true;
            }
        });

        var pages = [];

        pages.push({ name: "Experiment Dashboard", view: "Thesis" });
        pages.push({ name: "Data Viewer", view: "Data" });

        App.navigationBar.setPages(pages);
    },
    pageLoad: function (thisView) {
        I.mainBoard = new I.Board(I("#Board"), false, false, false);
        I.items = I.mainBoard.container;

        I.data = new I.DataViewer();
    },
    pageReady: function (thisView, data) {
    }
};