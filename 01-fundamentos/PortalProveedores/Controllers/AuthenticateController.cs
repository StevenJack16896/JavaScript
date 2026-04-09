using AppProveedores.BL;
using AppProveedores.DTO;
using AppProveedores.UIWEB.MVC.Filters.Authentication;
using AppProveedores.UTI.VarGlobal;
using AppProveedores.UTI.Exceptions;
using System;
using System.DirectoryServices;
using System.Web.Mvc;
using AppProveedores.UIWEB.MVC.Background;

namespace AppProveedores.UIWEB.MVC.Controllers
{
    public class AuthenticateController : Controller
    {
        public ActionResult Authenticate()
        {
            string message = string.Empty, url = string.Empty;
            string userName = Request.Form["UserName"], userPassword = Request.Form["UserPassword"];

            DTO_UserLogin user = BL_UserLogin.ExistsUserLogin(userName);
            if (user == null)
            {
                message = "El usuario no existe.";
                return Json(new { Message = message, Url = url }, JsonRequestBehavior.DenyGet);
            }

            if (user.cEstado != "1")
            {
                message = "Las credenciales están inactivas.";
                return Json(new { Message = message, Url = url }, JsonRequestBehavior.DenyGet);
            }

            if (user.cPerfil == UTI_VarGlobal.Constant.ProfileType.Proveedor)
            {
                user = BL_UserLogin.UserLogin(userName, userPassword);
                if (user == null)
                {
                    message = "Las credenciales son incorrectas.";
                    return Json(new { Message = message, Url = url }, JsonRequestBehavior.DenyGet);
                }
                else
                {
                    user.vcNameAD_Prov = user.vcLogin;
                }
            }
            else
            {
                string NombreCompleto = string.Empty;
                bool pasa = false;
                AutenticatheUser(user.vcLogin, userPassword, ref pasa, ref NombreCompleto);

                if (!pasa)
                {
                    message = "Las credenciales son incorrectas.";
                    return Json(new { Message = message, Url = url }, JsonRequestBehavior.DenyGet);
                }
                else
                {
                    user.vcNameAD_Prov = NombreCompleto;
                }
            }

            // Si las credenciales son correctas
            url = "Dashboard";
            message = "Bienvenido al sistema.";
            var session = HttpContext.Session;

            AuthenticationIdentity authIdentity = new AuthenticationIdentity(user.vcLogin, user.vcPassword)
            {
                UserID = user.vcLogin,
                UserName = user.vcNameAD_Prov,
                UserFullName = user.vcRazonSocial,
                UserCompanyCode = user.cRuc,
                UserProfileType = user.cPerfil,
                UserImage = user.url_photo,
                UserSAP = user.userSAP
            };

            if (session != null && session["AuthenticationIdentity"] == null)
            {
                session["AuthenticationIdentity"] = authIdentity;
                
                // También registras en el monitor global
                SessionMonitorBackgroundService.RegisterSession(authIdentity.UserID);

            }

            return Json(new { Message = message, Url = url }, JsonRequestBehavior.DenyGet);
        }


        public ActionResult ExpiredSession()
        {
            /*
            UTI_MsgResponse MsgResponse = new UTI_MsgResponse();
            MsgResponse.Operation = UTI_MsgOperation.TipoOperacion.SESSION.ToString();
            MsgResponse.Type = UTI_MsgOperation.TipoMensaje.Session.ToString();
            MsgResponse.Title = UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.TituloMensaje.AssistantSession);
            MsgResponse.Description = UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.VerifyExpiredSession);
            MsgResponse.Session = false;
            MsgResponse.Function = "Uti.Modal.Session()";
            */

            //return Json("", JsonRequestBehavior.AllowGet);
            //return RedirectToAction("LogOut", "Login");
            return Json(BL_UserLogin.MessageExpiredSession(), JsonRequestBehavior.AllowGet);
        }


        private void AutenticatheUser(string userName, string password, ref bool valid, ref string NombreCompleto)
        {
            valid = false;
            try
            {
                DirectoryEntry de = new DirectoryEntry(GetCurrentDomainPath(), userName, password);
                //DirectoryEntry de = new DirectoryEntry(GetCurrentDomainPath());
                DirectorySearcher dsearch = new DirectorySearcher(de);
                dsearch.Filter = "sAMAccountName=" + userName + "";
                SearchResult results = null;

                results = dsearch.FindOne();
                NombreCompleto = results.GetDirectoryEntry().Properties["DisplayName"].Value.ToString();
                string NTusername = results.GetDirectoryEntry().Properties["sAMAccountName"].Value.ToString();
                var co = results.GetDirectoryEntry().Properties["department"].Value.ToString();//department

                valid = true;

            }
            catch (Exception ex)
            {
                var logObject = new
                {
                    userName = userName,
                    password = password,
                    valid = valid,
                    NombreCompleto = NombreCompleto
                };
                var logObjectString = Newtonsoft.Json.JsonConvert.SerializeObject(logObject, Newtonsoft.Json.Formatting.Indented);
                UTI_ExceptionTable.InsHandleError(ex, logObjectString);

                valid = false;
            }
            //return valid;
        }

        private static string GetCurrentDomainPath()
        {
            System.DirectoryServices.DirectoryEntry de = new System.DirectoryServices.DirectoryEntry("LDAP://RootDSE");
            return "LDAP://" + de.Properties["defaultNamingContext"][0].ToString();
        }


    }
}