using System;
using System.Web.Mvc;
using AppProveedores.BL;
using AppProveedores.BL.Setting.Comunicado;
using AppProveedores.BL.Setting.Horario;
using AppProveedores.BL.RRHH.Documento;
using AppProveedores.DTO.Setting.Comunicado;
using AppProveedores.DTO.Setting.Horario;
using Newtonsoft.Json;
using AppProveedores.DTO;
using System.Text;
using AppProveedores.UIWEB.MVC.Filters.Authentication;
using System.IO;
using AppProveedores.UTI.VarGlobal;
using AppProveedores.UTI.Exceptions;
using AppProveedores.UIWEB.MVC.Background;

namespace AppProveedores.UIWEB.MVC.Controllers
{
    public class LoginController : Controller
    {
        
        public ActionResult Index()
        {
            DTO_Horario operativo = BL_Horario.GetScheduleOpera();

            
            ViewBag.ID = operativo.ID;
            ViewBag.vOutOfRangeMessage = operativo.vOutOfRangeMessage;
            
            return View();

        }

        public ActionResult LogOut()
        {

            var identity = Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (identity != null)
            {
                BL_Documento.UpdLiberarDocumentoDelAdmin(identity.UserID);
                SessionMonitorBackgroundService.RemoveSession(identity.UserID);
            }

            Session.RemoveAll();
            Session.Clear();
            Session.Abandon();
            return View("Index");
        }

        [HttpGet]
        public ActionResult GetComunicadosShow()
        {
            //return Json(BL_Comunicado.GetComunicadosShow(), JsonRequestBehavior.DenyGet);
            return Json(BL_Comunicado.GetComunicadosShow(),JsonRequestBehavior.AllowGet);
        }

        public ActionResult ForgotPassword()
        {
            return View();
        }

        public ActionResult ForgotPasswordConfirmation()
        {
            // Recupera el modelo de Session
            var model = Session["ForgotPasswordModel"] as ForgotPasswordViewModel;

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword(ForgotPasswordViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (BL_UserLogin.GetExistAnyCorreoxRuc(model.Ruc) == 0)
                    {
                        // Mensaje de error
                        ViewBag.ErrorMessage = "El RUC ingresado no tiene ningún contacto asociado.";

                        return View(model);
                    }
                    else
                    {
                        //Verificar que el Ruc y Correo existan y ambos esten activos.
                        if (BL_UserLogin.GetExistRucCorreo(model.Ruc, model.Email) != 1)
                        {
                            // Mensaje de error
                            ViewBag.ErrorMessage = "El correo no está asociado al Ruc.";

                            return View(model);
                        }
                        else
                        {

                            //Generar Token de Cambio de contraseña
                            var token = Guid.NewGuid().ToString();


                            //Aqui se guarda el token, fecha de expiracion y uso.
                            BL_UserLogin.UpdTokenPass(token, model.Ruc);


                            // Generar el enlace de restablecimiento de contraseña
                            string resetLink = Url.Action("ResetPassword", "Login",
                                                          new { token = token, email = model.Email, ruc = model.Ruc },
                                                          protocol: Request.Url.Scheme);


                            // Guarda el modelo en Session por si vaya a querer un reenvío del correo.
                            Session["ForgotPasswordModel"] = model;


                            string name = BL_UserLogin.GetNameRucCorreo(model.Ruc, model.Email);

                            BL_UserLogin.SendCorreoResetPassword(name, model.Email, resetLink);

                            return RedirectToAction("ForgotPasswordConfirmation");
                        }

                    }
                    
                }
            }
            catch (Exception ex)
            {
                var logObject = new {
                    model= model
                };
                var logObjectString = Newtonsoft.Json.JsonConvert.SerializeObject(logObject, Newtonsoft.Json.Formatting.Indented);

                UTI_ExceptionTable.InsHandleError(ex, logObjectString);

                return View("Error", model: "(500)Error interno del servidor.");
            }

            // Si algo falla, volvemos a mostrar el formulario
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResendForgotPasswordEmail()
        {
            try
            {
                
                var model = Session["ForgotPasswordModel"] as ForgotPasswordViewModel;

                if (!string.IsNullOrEmpty(model.Email))
                {
                    var token = Guid.NewGuid().ToString();

                    //Guarda el nuevo token generado
                    BL_UserLogin.UpdTokenPass(token, model.Ruc);


                    // Generar el enlace de restablecimiento de contraseña
                    string resetLink = Url.Action("ResetPassword", "Login",
                                                  new { token = token, email = model.Email, ruc = model.Ruc },
                                                  protocol: Request.Url.Scheme);

                    string name = BL_UserLogin.GetNameRucCorreo(model.Ruc, model.Email);

                    BL_UserLogin.SendCorreoResetPassword(name, model.Email, resetLink);

                    // Redirigir a la acción de confirmación
                    return RedirectToAction("ForgotPasswordConfirmation");
                }
                else
                {
                    return View("Error", model: "No se puede reenviar el correo porque no se encontró el correo electrónico en la sesión.");
                }
            }
            catch (Exception ex)
            {
                
                UTI_ExceptionTable.InsHandleError(ex, "LoginController -> ResendForgotPasswordEmail");

                return View("Error", model: "(500)Error interno del servidor.");
            }
        }

        //Se usa para el link del correo
        [HttpGet]
        public ActionResult ResetPassword(string token, string email, string ruc)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(ruc))
            {
                return View("Error", model: "Enlace incorrecto.");
            }

            var model = new ResetPasswordViewModel { Token = token, Email = email, Ruc = ruc };
            
            DTO_Token tokenBD = BL_UserLogin.GetLastTokenPass(ruc, email);

            if (tokenBD.vcPasswordResetToken != token)
            {
                return View("Error", model: "No es el último correo para cambiar la contraseña.");
            }
            else 
            {
                if (DateTime.Now > tokenBD.dtTokenExpiration)
                {
                    return View("Error", model: "Esta solicitud de cambio de contraseña ha expirado.");
                }
                else
                {
                    if (tokenBD.cTokenIsUsed == "S")
                    {
                        return View("Error", model: "Ya se usó este enlace para el cambio de contraseña.");
                    }
                    else
                    {
                        return View("ResetPassword", model);
                    }
                    
                }

                
            }


        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                DTO_Token tokenBD = BL_UserLogin.GetLastTokenPass(model.Ruc, model.Email);

                if (tokenBD.vcPasswordResetToken != model.Token)
                {
                    return View("Error", model: "No es el último correo para cambiar la contraseña.");
                }
                else
                {
                    if (DateTime.Now > tokenBD.dtTokenExpiration)
                    {
                        return View("Error", model: "Esta solicitud de cambio de contraseña ha expirado.");
                    }
                    else
                    {
                        if (tokenBD.cTokenIsUsed == "S")
                        {
                            return View("Error", model: "Ya se usó este enlace para el cambio de contraseña.");
                        }
                        else
                        {
                            //Cumplió token, expiracion y uso
                            BL_UserLogin.UpdPasswordReset(model.Ruc, model.Email, model.NewPassword);

                            // Luego, actualiza la contraseña en la base de datos.
                            Session["ForgotPasswordEmail"] = null;

                            // Si la actualización es exitosa, redirige a una vista de confirmación o login.
                            return RedirectToAction("PasswordResetConfirmation");


                        }

                    }


                }
                
            }

            // Si el modelo no es válido, vuelve a mostrar la vista con errores.
            return View(model);
        }

        public ActionResult PasswordResetConfirmation()
        {
            return View();
        }


        public ActionResult MostrarImagen()
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            
            var ruta = Session.UserImage;
            byte[] archivoBytes = null;

            if (ruta == "sin_foto")
            {
               archivoBytes = null;
            }
            else
            {
                archivoBytes = System.IO.File.ReadAllBytes(ruta);
            }
            
            
            if (archivoBytes != null )
            {
                // Devuelve los bytes de la imagen como un archivo
                return File(archivoBytes, "image/jpeg"); // Ajusta el tipo MIME según sea necesario
            }
            else
            {
                return HttpNotFound(); // O maneja el error como prefieras
            }
        }

        [HttpPost]
        public ActionResult GetManualPDF()
        {
            string filePath = Path.Combine(UTI_VarGlobal.Constant.ManualFiles.ManualLogin);
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
                UTI_ExceptionTable.InsHandleError(ex, "LoginController -> GetManualPDF");
                return new HttpStatusCodeResult(500, "Error al procesar el archivo PDF.");
            }

        }


    }
}
