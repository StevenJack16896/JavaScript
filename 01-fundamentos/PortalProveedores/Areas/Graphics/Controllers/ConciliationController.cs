using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppProveedores.UIWEB.MVC.Areas.Graphics.Controllers
{
    public class ConciliationController : Controller
    {
        // GET: Graphics/Conciliation
        public ActionResult Index()
        {
            return View("ConciliationIndex");
        }
    }
}