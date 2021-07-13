using Sysmo.Web.Api;

namespace Scriptie
{
    public class RouteConfig
    {
        public static void RegisterRoutes(Map map)
        {

            map.AddRoute("{method}", "View", "Scriptie");
        }
    }
}