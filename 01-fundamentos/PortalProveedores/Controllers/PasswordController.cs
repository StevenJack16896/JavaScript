using AppProveedores.UIWEB.MVC.Filters.Authentication;
using AppProveedores.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppProveedores.UIWEB.MVC.Controllers
{
    public class PasswordController : Controller
    {
        // GET: Password
        public ActionResult Index()
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }

            ViewBag.Proveedor = Session.UserID;
            ViewBag.UserProfileType = Session.UserProfileType;


            return View();
        }

        [HttpPost]
        public ActionResult UpdPassword(string login, string passActual, string passNew, string perfil)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            return Json(BL_Password.UpdPassword(Session.UserID, passActual, passNew, Session.UserProfileType), JsonRequestBehavior.DenyGet);

        }

    }
}