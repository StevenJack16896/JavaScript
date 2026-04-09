using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AppProveedores.UIWEB.MVC.Background;
using AppProveedores.UIWEB.MVC.Controllers;
using AppProveedores.UIWEB.MVC.Filters.Authentication;

namespace AppProveedores.UIWEB.MVC.Filters.Authorization
{
    public class AuthorizationController : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext filterContext)

        {
            if (HttpContext.Current.Session["AuthenticationIdentity"] == null) //Si el usuario no esta autenticado
            {
                String NameController = HttpContext.Current.Request.RequestContext.RouteData.Values["controller"].ToString();
                String NameAction = HttpContext.Current.Request.RequestContext.RouteData.Values["action"].ToString();

                // Permitir acceso a la acción ForgotPassword en LoginController
                if (NameController == "Login" && (NameAction == "ForgotPassword" || 
                                                NameAction == "ResendForgotPasswordEmail" || 
                                                NameAction == "ResetPassword" || 
                                                NameAction == "GetManualPDF") )
                {
                    base.OnActionExecuting(filterContext);
                    return;
                }


                if (HttpContext.Current.Request.HttpMethod == "GET" && NameController != "Lock") //Intenta entrar a una url
                {
                    if (filterContext.Controller is AuthenticateController == false)//Que no sea el login
                    {
                        if (filterContext.Controller is LoginController == false)
                        {
                            HttpContext.Current.Response.Redirect("~/Login/Index");
                        }
                    }
                }
                else
                {
                    if (NameController == "Login" && NameAction == "UpdLiberarDocumentoDelAdmin")
                    {
                        base.OnActionExecuting(filterContext);
                        return;
                    }

                    if (HttpContext.Current.Request.HttpMethod == "POST" && NameController != "Authenticate" )
                    {
                        String SegmentoUrl = HttpContext.Current.Request.Url.PathAndQuery.Substring(1, HttpContext.Current.Request.Url.PathAndQuery.ToString().Length - 1);
                        if (SegmentoUrl.Contains("/"))
                        {
                            SegmentoUrl = SegmentoUrl.Split('/')[0];
                        }
                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary{
                              { "Controller",(SegmentoUrl==NameController ? "Authenticate" :"../Authenticate")},
                              { "Action", "/ExpiredSession" }
                     });
                    }
                }
            }
            else  //Si el usuario esta authenticado
            {
                var session = HttpContext.Current.Session["AuthenticationIdentity"] as AuthenticationIdentity;
                // Refresca el tiempo del usuario activo
                SessionMonitorBackgroundService.RegisterSession(session.UserID);

                if (filterContext.Controller is LoginController == true /*&& NameAction != "ForgotPassword"*/)
                {
                    HttpContext.Current.Response.Redirect("~/Dashboard");
                }
            }
            base.OnActionExecuting(filterContext);
        }


    }
}