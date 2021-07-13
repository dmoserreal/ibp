using Sysmo.Web.Api;

namespace Scriptie
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            var jsBundle = InterfaceBundle.InitJavascriptBundle(bundles, "js", false);

            jsBundle.IncludeFiles(
                        "/Content/JS/AppConfig.js",
                        "Bundle:http://localhost:777/Bundles/ABCJS",
                        "/Content/JS/PSO.js",
                        "/Content/JS/ASO.js",
                        "/Content/JS/ExperimentRunner.js",
                        "/Content/JS/DataViewer.js"
                     );

            jsBundle.AddOnloadFallback();

            var cssBundle = InterfaceBundle.InitCSSBundle(bundles, "css", false);

            cssBundle.IncludeFiles(
                        "Bundle:http://localhost:777/Bundles/ABCCSS",

                        /* Body CSS */
                        "/Content/CSS/Fonts.css"
                        );
        }
    }
}