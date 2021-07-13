using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Globalization;
using Sysmo;
using Sysmo.AccountProviders;
using Sysmo.Storage;
using Sysmo.Web;
using Sysmo.Web.Api;

namespace Scriptie
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            if (WebApi.Loaded)
                return;

            var c = CultureInfo.GetCultureInfo("en-US");
            CultureInfo.DefaultThreadCurrentCulture = c;
            CultureInfo.DefaultThreadCurrentUICulture = c;

            var config = new WebAppConfiguration()
            {
                DefaultIssueExplanation = new IssueExplanation(
                    userMessage: "A server error occurred.",
                    developerMessage: "This is the default fallback 'issue' for Thesis."
                    )
            };

            WebApp.Init(config);

            WebApiConfiguration webApiConfig = new WebApiConfiguration(logInRoute: new RouteTemplate("LogIn", "View", "LogIn"));

            WebApi.Init(webApiConfig);
            WebApi.OnErrorResponse += OnError;

            RouteConfig.RegisterRoutes(WebApi.Map);
            BundleConfig.RegisterBundles(WebApi.Bundles);

            Storage.Provider = new SqlDatabase(Thesis_Config.Thesis_Database.Value);


        }

        public void OnError(Error error, WebContext context)
        {
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}