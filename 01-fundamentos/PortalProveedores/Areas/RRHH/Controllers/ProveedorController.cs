using AppProveedores.BL.RRHH.Proveedor;
using AppProveedores.BL.RRHH.Documento;
using AppProveedores.UIWEB.MVC.Filters.Authentication;
using AppProveedores.DTO.RRHH.Documento;
using AppProveedores.DTO.RRHH.Proveedor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppProveedores.UIWEB.MVC.Areas.RRHH.Controllers
{
    public class ProveedorController : Controller
    {
        // GET: RRHH/Proveedor
        public ActionResult Index()
        {

            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }
            
            ViewBag.codEmpresa = Session.UserCompanyCode;
            ViewBag.RazonSocial = Session.UserFullName;
            ViewBag.UserProfileType = Session.UserProfileType;

            ViewBag.ProveedorAll = BL_Proveedor.GetProveedorAllMantenedor();


            return View("ProveedorIndex");
        }



        [HttpPost]
        public ActionResult GetContactos(string CodProveedor)
        {
            return Json(BL_Proveedor.GetContactos(CodProveedor), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UpdContacto(DTO_ContactoProveedor ContacProvee)
        {
            return Json(BL_Proveedor.UpdContacto(ContacProvee), JsonRequestBehavior.DenyGet);
        }
        

        [HttpPost]
        public ActionResult InsContacto(DTO_ContactoProveedor ContacProvee)
        {
            return Json(BL_Proveedor.InsContacto(ContacProvee), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetProveedor(string ruc)
        {
             return Json(BL_Proveedor.GetProveedor(ruc), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UpdProveedor(DTO_Proveedor Proveedor)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;

            var RazonSocialAnterior = BL_Proveedor.GetProveedor(Proveedor.cRuc).vcRazonSocial;

            var dto = new DTO_ProveedorAuditoria { 
                cRuc = Proveedor.cRuc,
                RazonSocialAnterior = RazonSocialAnterior,
                RazonSocialNueva = Proveedor.vcRazonSocial
            };
            BL_Proveedor.InsProveedorAuditoria(dto);

            var resultado = BL_Proveedor.UpdProveedor(Proveedor, Session.UserProfileType);

            

            // Obtener la lista actualizada de proveedores
            var proveedoresActualizados = BL_Proveedor.GetProveedorAllMantenedor();

            // Incluir la lista actualizada de proveedores en el resultado
            return Json(new
            {
                resultado = resultado,
                proveedoresActualizados = proveedoresActualizados
            }, JsonRequestBehavior.DenyGet);

        }

        [HttpPost]
        public ActionResult InsProveedor(DTO_Proveedor proveedor)
        {

            var resultado = BL_Proveedor.InsProveedor(proveedor);

            // Obtener la lista actualizada de proveedores
            var proveedoresActualizados = BL_Proveedor.GetProveedorAllMantenedor();

            return Json(new
            {   resultado = resultado,
                proveedoresActualizados = proveedoresActualizados 
            });


            //return Json(BL_Proveedor.InsProveedor(proveedor), JsonRequestBehavior.DenyGet);
        }


    }
}