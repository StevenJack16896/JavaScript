using System.Web.Mvc;
using AppProveedores.UIWEB.MVC.Filters.Authentication;
using AppProveedores.UIWEB.MVC.Services;
using AppProveedores.UIWEB.MVC.ZWS_ORD;
using AppProveedores.UIWEB.MVC.ZWS_ENTREGA;
using System.Collections.Generic;
using AppProveedores.BL.Setting.Horario;
using AppProveedores.BL.Setting.Comunicado;
using AppProveedores.DTO.Setting.Horario;
using AppProveedores.DTO.Setting.Comunicado;
using AppProveedores.UTI.VarGlobal;
using AppProveedores.UTI.Exceptions;
using System;
using System.IO;

namespace AppProveedores.UIWEB.MVC.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        public ActionResult Index()
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }
            ViewBag.Proveedor = Session.UserID;
            ViewBag.UserProfileType = Session.UserProfileType;


            DTO_Horario operativo = BL_Horario.GetScheduleOpera();

            bool HabilitaSistema = BL_Comunicado.GetComunicadoHabilitaSistema();
            bool BloqueaSistema = BL_Comunicado.GetComunicadoBloqueaSistema();

            
            bool fueraDeHorarioLaboral = operativo.ID > 0;
            bool debeRedirigir = false;

            
            if (fueraDeHorarioLaboral)
            {
                debeRedirigir = !HabilitaSistema && Session.UserProfileType != UTI_VarGlobal.Constant.ProfileType.Admin;
            }
            else
            {
                debeRedirigir = BloqueaSistema && Session.UserProfileType != UTI_VarGlobal.Constant.ProfileType.Admin;
            }

            
            if (debeRedirigir)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }
            else
            {
                return View();
            }

        }

        [HttpPost]
        public ActionResult GetPendientesEntregaSAP(string id_proveedor) 
        {
            return Json(NCO.Entregas(id_proveedor), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetPendientesHesSap(string id_proveedor)
        {
            return Json(NCO.ListaPendientesHES(id_proveedor), JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult GetRRHHUrl()
        {
            // Genera la URL para la acción dentro del área
            string url = Url.Action("Index", "Documento", new { area = "RRHH" });
            return Json(new { url = url }, JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult GetManualPDF()
        {
            string filePath = Path.Combine(UTI_VarGlobal.Constant.ManualFiles.ManualDashboard);
            string nameFile = Path.GetFileName(filePath);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    return File(filePath, "application/pdf", nameFile);
                }
                else
                {
                    return new HttpStatusCodeResult(404, "El archivo no existe.");
                }
            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Dashboard Controller -> GetManualPDF, Error al procsar el archivo PDF");

                return new HttpStatusCodeResult(500, "Error al procesar el archivo PDF.");
            }
        }



    }
}