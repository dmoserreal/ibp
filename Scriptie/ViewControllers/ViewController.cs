using System.Web;
using Sysmo.Web;
using Sysmo.Web.Api;

namespace Scriptie
{
    [StaticViewController("")]
    [Route("/")]
    public class ViewController : ViewController<SessionData>
    {
        [StaticView(path: "Master")]
        public void MasterView()
        {
        }

        [StaticView(parent: "MasterView")]
        [DefaultMethod]
        public void Thesis() { }

        [StaticView(parent: "MasterView")]
        public void Data() { }
    }
}