using AppProveedores.DTO.RRHH.Documento;
using AppProveedores.BL.RRHH.Documento;
using AppProveedores.BL.RRHH.Proveedor;
using AppProveedores.UIWEB.MVC.Filters.Authentication;
using AppProveedores.UTI.VarGlobal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClosedXML.Excel;
using System.IO;
using AppProveedores.UIWEB.MVC.Services;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;
using System.Net;
using System.Xml.Linq;
using AppProveedores.UTI.Mensajes;
using AppProveedores.UTI.Exceptions;
using Newtonsoft.Json;
using AppProveedores.BL.UTI;

namespace AppProveedores.UIWEB.MVC.Areas.RRHH.Controllers
{
    public class DocumentoController : Controller
    {
        // GET: RRHH/Documento
        public ActionResult Index(string Provee, string OrdCompra, string NroEntregas, string GuiaOrHes, string nroHES)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }

            if (OrdCompra != null)
            {
                ViewBag.FromDashProvee = Provee;
                ViewBag.FromDashOrdCompra = OrdCompra;
                ViewBag.FromDashNroEntregas = NroEntregas;
                ViewBag.GuiaOrHes = GuiaOrHes;
                ViewBag.FromDashNroHES = nroHES;
            }
            else
            {
                ViewBag.FromDashProvee = Session.UserName;
                ViewBag.FromDashOrdCompra = null;
                ViewBag.FromDashNroEntregas = null;
                ViewBag.GuiaOrHes = null;
                ViewBag.FromDashNroHES = null;
            }

            ViewBag.UserID = Session.UserID;
            ViewBag.UserProfileType = Session.UserProfileType;
            ViewBag.cod_empresa = Session.UserCompanyCode;
            ViewBag.fullName = Session.UserFullName;


            DateTime fechaActual = DateTime.Now;
            string CurrentDate = fechaActual.ToString("dd/MM/yyyy");
            ViewBag.CurrentDate = CurrentDate;
            ViewBag.MaxSize = UTI_VarGlobal.Constant.MaxSize.DocSubidos;



            return View("DocumentoIndex");

            //ViewBag.CurrentDate = DateTime.Now();
        }

        [HttpPost]
        public ActionResult GetDocumentSearch(DTO_DocumentoParamSearch documentoParamSearch)
        {
            return Json(BL_Documento.GetDocumentSearch(documentoParamSearch), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetProveedorAll()
        {
            return Json(BL_Documento.GetProveedorAll(), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult ExportToExcel(List<DTO_DocumentoParamRest> data)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;


            byte[] fileByte = null;


            using (var workbook = new XLWorkbook())
            {
                if (Session.UserProfileType == UTI_VarGlobal.Constant.ProfileType.Admin)
                {

                    var worksheet = workbook.Worksheets.Add("Proveedores");
                    worksheet.Cell(1, 1).Value = "Fecha de Registro";
                    worksheet.Cell(1, 2).Value = "Fecha de Emisión";
                    worksheet.Cell(1, 3).Value = "Proveedor";
                    worksheet.Cell(1, 4).Value = "Razón Social";
                    worksheet.Cell(1, 5).Value = "Sociedad";
                    worksheet.Cell(1, 6).Value = "Clase de Documento";
                    worksheet.Cell(1, 7).Value = "Nro. Documento";
                    worksheet.Cell(1, 8).Value = "Tipo de Moneda";
                    worksheet.Cell(1, 9).Value = "Monto";
                    worksheet.Cell(1, 10).Value = "Clase de Orden de Compra";
                    worksheet.Cell(1, 11).Value = "Nro. Orden de Compra";
                    worksheet.Cell(1, 12).Value = "Nro. Guia";
                    worksheet.Cell(1, 13).Value = "Estado";
                    worksheet.Cell(1, 14).Value = "Nro. Doc. MIRO";
                    worksheet.Cell(1, 15).Value = "Nro. Doc. FI";
                    worksheet.Cell(1, 16).Value = "Motivo Anulación";
                    worksheet.Cell(1, 17).Value = "Comentarios";
                    worksheet.Cell(1, 18).Value = "Seguimiento";

                    for (int i = 0; i < data.Count; i++)
                    {
                        worksheet.Cell(i + 2, 1).Value = data[i].FecRegistro;
                        worksheet.Cell(i + 2, 2).Value = data[i].FecDoc;
                        worksheet.Cell(i + 2, 3).Value = data[i].CodProveedor;
                        worksheet.Cell(i + 2, 4).Value = data[i].RazonSocial;
                        worksheet.Cell(i + 2, 5).Value = data[i].IdSociedad;
                        worksheet.Cell(i + 2, 6).Value = data[i].TipoDoc;
                        worksheet.Cell(i + 2, 7).Value = data[i].NroDoc;
                        worksheet.Cell(i + 2, 8).Value = data[i].MonDoc;
                        worksheet.Cell(i + 2, 9).Value = data[i].MontoDoc;
                        worksheet.Cell(i + 2, 10).Value = data[i].TipoDocOc;
                        worksheet.Cell(i + 2, 11).Value = data[i].NroDocOc;
                        worksheet.Cell(i + 2, 12).Value = data[i].NroGuia;
                        worksheet.Cell(i + 2, 13).Value = data[i].EstDoc;
                        worksheet.Cell(i + 2, 14).Value = data[i].DocMiroSap;
                        worksheet.Cell(i + 2, 15).Value = data[i].DocFiSap;
                        worksheet.Cell(i + 2, 16).Value = data[i].EstObs;
                        worksheet.Cell(i + 2, 17).Value = data[i].ComenDoc;
                        worksheet.Cell(i + 2, 18).Value = data[i].ComenSegui;
                    }

                    // Ajustar el ancho de las columnas
                    worksheet.Columns().AdjustToContents();

                    //Definir, crear y dar formato Tabla
                    var range = worksheet.Range(1, 1, data.Count() + 1, 18);
                    var dataTable = range.CreateTable();
                    dataTable.Theme = XLTableTheme.TableStyleMedium2;

                }
                else
                {

                    var worksheet = workbook.Worksheets.Add("Proveedores");
                    worksheet.Cell(1, 1).Value = "Fecha de Registro";
                    worksheet.Cell(1, 2).Value = "Fecha de Emisión";
                    //worksheet.Cell(1, 3).Value = "Proveedor";
                    //worksheet.Cell(1, 4).Value = "Razón Social";
                    //worksheet.Cell(1, 5).Value = "Sociedad";
                    //worksheet.Cell(1, 6).Value = "Clase de Documento";
                    worksheet.Cell(1, 3).Value = "Nro. Documento";
                    worksheet.Cell(1, 4).Value = "Tipo de Moneda";
                    worksheet.Cell(1, 5).Value = "Monto";
                    worksheet.Cell(1, 6).Value = "Clase de Orden de Compra";
                    worksheet.Cell(1, 7).Value = "Nro. Orden de Compra";
                    worksheet.Cell(1, 8).Value = "Nro. Guia";
                    worksheet.Cell(1, 9).Value = "Estado";
                    //worksheet.Cell(1, 13).Value = "Nro. Doc. MIRO";
                    worksheet.Cell(1, 10).Value = "Nro. Doc. FI";
                    worksheet.Cell(1, 11).Value = "Motivo Anulación";
                    worksheet.Cell(1, 12).Value = "Comentarios";

                    for (int i = 0; i < data.Count; i++)
                    {
                        worksheet.Cell(i + 2, 1).Value = data[i].FecRegistro;
                        worksheet.Cell(i + 2, 2).Value = data[i].FecDoc;
                        //worksheet.Cell(i + 2, 3).Value = data[i].CodProveedor;
                        //worksheet.Cell(i + 2, 4).Value = data[i].RazonSocial;
                        //worksheet.Cell(i + 2, 5).Value = data[i].IdSociedad;
                        //worksheet.Cell(i + 2, 6).Value = data[i].TipoDoc;
                        worksheet.Cell(i + 2, 3).Value = data[i].NroDoc;
                        worksheet.Cell(i + 2, 4).Value = data[i].MonDoc;
                        worksheet.Cell(i + 2, 5).Value = data[i].MontoDoc;
                        worksheet.Cell(i + 2, 6).Value = data[i].TipoDocOc;
                        worksheet.Cell(i + 2, 7).Value = data[i].NroDocOc;
                        worksheet.Cell(i + 2, 8).Value = data[i].NroGuia;
                        worksheet.Cell(i + 2, 9).Value = data[i].EstDoc;
                        //worksheet.Cell(i + 2, 13).Value = data[i].DocMiroSap;
                        worksheet.Cell(i + 2, 10).Value = data[i].DocFiSap;
                        worksheet.Cell(i + 2, 11).Value = data[i].EstObs;
                        worksheet.Cell(i + 2, 12).Value = data[i].ComenDoc;
                    }

                    // Ajustar el ancho de las columnas
                    worksheet.Columns().AdjustToContents();

                    //Definir, crear y dar formato Tabla
                    var range = worksheet.Range(1, 1, data.Count() + 1, 12); /*12*/
                    var dataTable = range.CreateTable();
                    dataTable.Theme = XLTableTheme.TableStyleMedium2;

                }



                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                    fileByte = stream.ToArray();
                    //var content = stream.ToArray();
                    //return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Proveedores.xlsx");
                }

            }

            if (fileByte != null)
            {
                FileContentResult fileContentResult = File(fileByte, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                fileByte = fileContentResult.FileContents;
            }

            var json = Json(new { fileByte = fileByte, message = fileByte == null ? "NULL" : "OK" }, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;


        }

        public ActionResult GetDetalleDocumento(string cod_documento)
        {
            return Json(BL_Documento.GetDetalleDocumento(cod_documento), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetOrdenesCompraSAP(string id_proveedor, string id_OrdCompra)
        {
            return Json(NCO.Ordenes(id_proveedor, id_OrdCompra), JsonRequestBehavior.DenyGet);
        }//Llenar con SAP 1. Orden De Compra

        [HttpPost]
        public ActionResult GetGuiasDeOrdCompraSAP(string id_OrdCompra, string sociedad)
        {
            var datosGUIAS = NCO.GUIAS_2024(id_OrdCompra, sociedad);

            return Json(datosGUIAS, JsonRequestBehavior.DenyGet);
        }//Llenar con SAP 2. Ingresos Asociados para GUIAS

        [HttpPost]
        public ActionResult GetHESDeOrdCompraSAP(string id_OrdCompra, string nro_hes, string sociedad)
        {

            var datosHES = NCO.HES_2024(id_OrdCompra, nro_hes, sociedad);

            return Json(datosHES, JsonRequestBehavior.DenyGet);
        }//Llenar con SAP 2. Ingresos Asociados para HES

        [HttpPost]
        public ActionResult GetPdf(string nro_ord_oc, string nro_adj, string path, string g_h, string ruc)
        {
            string filePath = string.Empty;
            if (nro_adj == "") //Solo se busca la OC
            {
                filePath = Path.Combine(UTI_VarGlobal.Constant.DocumentDirectory.PATH_DIRECTORY_PDF, nro_ord_oc);
            }
            else// Se busca los pdf's asociados a la OC, ya vienen con sus extensiones de pdf
            {
                if (g_h == "G")
                {
                    string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);
                    filePath = Path.Combine(pathServer, "GUIA_" + nro_adj);
                }
                else
                {
                    string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);
                    filePath = Path.Combine(pathServer, "HES_" + nro_adj);
                }

            }

            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();
            try
            {

                var parts = path.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    if (g_h == "G")
                    {
                        newFilePath = Path.Combine(newPathServer, "GUIA_" + nro_adj);
                    }
                    else
                    {
                        newFilePath = Path.Combine(newPathServer, "HES_" + nro_adj);
                    }

                    if (System.IO.File.Exists(newFilePath))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(newFilePath);
                        return File(fileBytes, "application/pdf");
                    }

                }

                if (System.IO.File.Exists(filePath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(fileBytes, "application/pdf");
                }
                else
                {
                    byte[] fileBytes = new byte[0];
                    return File(fileBytes, "application/pdf");
                }



            }
            catch (Exception ex)
            {
                var logObject = new
                {
                    nro_ord_oc = nro_ord_oc,
                    nro_adj = nro_adj,
                    path = path,
                    g_h = g_h
                };
                var logObjectString = Newtonsoft.Json.JsonConvert.SerializeObject(logObject, Newtonsoft.Json.Formatting.Indented);
                BL_UTI_Exception.InsHandleError(ex, logObjectString);

                return HttpNotFound();
            }

        }

        [HttpGet]
        public ActionResult GetXmlElectronico(string path, string nameFile, string ruc)
        {
            path = HttpUtility.UrlDecode(path);
            nameFile = HttpUtility.UrlDecode(nameFile);
            ruc = HttpUtility.UrlDecode(ruc);


            string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);

            string preNameFile = "XML_" + nameFile;

            string filePath = Path.Combine(pathServer, preNameFile);


            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();
            try
            {

                var parts = path.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    newFilePath = Path.Combine(newPathServer, "XML_" + nameFile);


                    if (System.IO.File.Exists(newFilePath))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(newFilePath);
                        return File(fileBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                    }

                }


                if (System.IO.File.Exists(filePath))
                {
                    byte[] archivoBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(archivoBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                }
                else
                {
                    return new HttpStatusCodeResult(HttpStatusCode.NoContent, $"{UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorFile)}: {preNameFile}.");
                }
            }
            catch (Exception ex)
            {
                //new UTI_Exception(ex, "Documento Controller -> GetXmlElectronico");
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetXmlElectronico");
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorException));
            }

        }

        [HttpGet]
        public ActionResult GetCDRElectronico(string path, string nameFile, string ruc)
        {
            path = HttpUtility.UrlDecode(path);
            nameFile = HttpUtility.UrlDecode(nameFile);
            ruc = HttpUtility.UrlDecode(ruc);

            string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);
            string preNameFile = "CDR_" + nameFile;
            string filePath = Path.Combine(pathServer, preNameFile);


            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();

            try
            {

                var parts = path.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    newFilePath = Path.Combine(newPathServer, "CDR_" + nameFile);


                    if (System.IO.File.Exists(newFilePath))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(newFilePath);
                        return File(fileBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                    }

                }



                if (System.IO.File.Exists(filePath))
                {
                    byte[] archivoBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(archivoBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                }
                else
                {
                    return new HttpStatusCodeResult(HttpStatusCode.NoContent, $"{UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorFile)}: {preNameFile}.");
                }
            }
            catch (Exception ex)
            {
                //new UTI_Exception(ex, "Documento Controller -> GetCDRElectronico");
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetCDRElectronico");
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorException));
            }

        }

        [HttpGet]
        public ActionResult GetPDFElectronico(string path, string nameFile, string ruc)
        {
            path = HttpUtility.UrlDecode(path);
            nameFile = HttpUtility.UrlDecode(nameFile);
            ruc = HttpUtility.UrlDecode(ruc);

            string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);
            string preNameFile = "FAC_" + nameFile;
            string filePath = Path.Combine(pathServer, preNameFile);



            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();

            try
            {

                var parts = path.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    newFilePath = Path.Combine(newPathServer, "FAC_" + nameFile);


                    if (System.IO.File.Exists(newFilePath))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(newFilePath);
                        return File(fileBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                    }

                }



                if (System.IO.File.Exists(filePath))
                {
                    byte[] archivoBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(archivoBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                }
                else
                {
                    return new HttpStatusCodeResult(HttpStatusCode.NoContent, $"{UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorFile)}: {preNameFile}.");
                }
            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetPDFElectronico");
                //new UTI_Exception(ex, "Documento Controller -> GetPDFElectronico");
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorException));
            }

        }

        [HttpGet]
        public ActionResult GetSUSElectronico(string path, string nameFile, string ruc)
        {

            path = HttpUtility.UrlDecode(path);
            nameFile = HttpUtility.UrlDecode(nameFile);
            ruc = HttpUtility.UrlDecode(ruc);


            string pathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);
            string preNameFile = "SUS_" + nameFile;
            string filePath = Path.Combine(pathServer, preNameFile);


            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();
            try
            {

                var parts = path.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    newFilePath = Path.Combine(newPathServer, "SUS_" + nameFile);
                    

                    if (System.IO.File.Exists(newFilePath))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(newFilePath);
                        return File(fileBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                    }

                }


                if (System.IO.File.Exists(filePath))
                {
                    byte[] archivoBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(archivoBytes, UTI_VarGlobal.Constant.ContentType.PdfContentType, preNameFile);
                }
                else
                {
                    return new HttpStatusCodeResult(HttpStatusCode.NoContent, $"{UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorFile)}: {preNameFile}.");
                }
            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetSUSElectronico");
                //new UTI_Exception(ex, "Documento Controller -> GetSUSElectronico");
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.DescripcionMensaje.ErrorException));
            }

        }



        [HttpPost]
        public ActionResult GetPdfAsociadosHES(string nro_hes)
        {
            string filePath = string.Empty;

            filePath = Path.Combine(UTI_VarGlobal.Constant.Path.HES, nro_hes + ".pdf");

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(fileBytes, "application/pdf");
                }
                else
                {
                    byte[] fileBytes = new byte[0];
                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetPdfAsociadosHES");
                return HttpNotFound();
            }

        }

        [HttpPost]
        public ActionResult GetPdfAsociadosGUIAS(string nro_entrega, string nro_sociedad)
        {
            string filePath = string.Empty;
            string sociedad = string.Empty;

            if (nro_sociedad == "1000")
            {
                sociedad = "SPM";
            }
            else if (nro_sociedad == "2000")
            {
                sociedad = "CMC";
            }
            else
            {
                sociedad = "AOM";
            }


            filePath = Path.Combine(UTI_VarGlobal.Constant.Path.OC, sociedad, nro_entrega + ".pdf");

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(fileBytes, "application/pdf");
                }
                else
                {
                    byte[] fileBytes = new byte[0];
                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> GetPdfAsociadosGUIAS");
                return HttpNotFound();
            }

        }

        [HttpPost]
        public ActionResult InsCabDocumento(DTO_DocumentoCabecera CabDocumento, string GuiaOrHes, List<string> lista_NroHes)
        {
            return Json(BL_Documento.InsCabDocumento(CabDocumento, GuiaOrHes, lista_NroHes), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult InsCabDocumentoConDocAdjuntados(DTO_DocumentoCabecera CabDocumento, string GuiaOrHes, List<string> lista_NroHes, string UploadlistIngreAsoc, string Uploadlistnrohes)
        {
            var nroHesList = JsonConvert.DeserializeObject<List<string>>(Uploadlistnrohes); //Solo son las HES en string
            var ingresoAsocList = JsonConvert.DeserializeObject<List<string>>(UploadlistIngreAsoc); //Solo son los MIGOS en string

            return Json(BL_Documento.InsCabDocumentoConDocAdjuntados(CabDocumento, GuiaOrHes, lista_NroHes, ingresoAsocList, nroHesList), JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult InsDocumentoIdentity(DTO_DocumentoCabecera CabDocumento, string GuiaOrHes, List<string> lista_NroHes, string UploadlistIngreAsoc, string Uploadlistnrohes)
        {
            var nroHesList = JsonConvert.DeserializeObject<List<string>>(Uploadlistnrohes); //Solo son las HES en string
            var ingresoAsocList = JsonConvert.DeserializeObject<List<string>>(UploadlistIngreAsoc); //Solo son los MIGOS en string

            return Json(BL_Documento.InsDocumentoIdentity(CabDocumento, GuiaOrHes, lista_NroHes, ingresoAsocList, nroHesList), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetTrackingDocProvee(string cod_proveedor, string id_documento)
        {
            return Json(BL_Documento.GetTrackingDocProvee(cod_proveedor, id_documento), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UploadFiles(string path, string OC, string G_H, string Uploadlistnrohes, string UploadlistIngreAsoc, string sociedadAjax1, int id_documento)
        {
            string DirectoryFiles = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path);

            try
            {
                

                var nroHesList = JsonConvert.DeserializeObject<List<string>>(Uploadlistnrohes); //Solo son las HES en string
                var ingresoAsocList = JsonConvert.DeserializeObject<List<string>>(UploadlistIngreAsoc); //Solo son los MIGOS en string

                //Copiando los adjuntos de las guias, XML, CDR y PDF
                if (Request.Files.Count > 0 && !string.IsNullOrEmpty(path))
                {
                    foreach (string fileName in Request.Files)
                    {
                        HttpPostedFileBase file = Request.Files[fileName];

                        if (file != null && file.ContentLength > 0)
                        {
                            string filePath = string.Empty;

                            if (fileName == "fileXML")
                            {
                                filePath = Path.Combine(DirectoryFiles, "XML_" + file.FileName);
                            }
                            else if (fileName == "fileCDR")
                            {
                                filePath = Path.Combine(DirectoryFiles, "CDR_" + file.FileName);
                            }
                            else if (fileName == "filePDF")
                            {
                                filePath = Path.Combine(DirectoryFiles, "FAC_" + file.FileName);
                            }
                            else if (fileName == "filePDFSUS")
                            {
                                filePath = Path.Combine(DirectoryFiles, "SUS_" + file.FileName);
                            }
                            else
                            {
                                if (G_H == "G")
                                {
                                    filePath = Path.Combine(DirectoryFiles, "GUIA_" + file.FileName);
                                }
                                else
                                {
                                    filePath = Path.Combine(DirectoryFiles, "HES_" + file.FileName);
                                }

                            }


                            if (!Directory.Exists(DirectoryFiles))
                            {
                                BL_Documento.CrearDirectorio(DirectoryFiles);
                            }

                            file.SaveAs(filePath);

                        }
                    }
                }



                //Copiando la Orden de Compra
                string pathOCSource = Path.Combine(UTI_VarGlobal.Constant.DocumentDirectory.PATH_DIRECTORY_PDF, OC + ".pdf");
                string pathOCDestiny = Path.Combine(DirectoryFiles, "OC_" + OC + ".pdf");
                if (System.IO.File.Exists(pathOCSource))
                {
                    // Asegurarse de que el directorio de destino exista
                    string destinationDirectory = Path.GetDirectoryName(DirectoryFiles);
                    if (!Directory.Exists(destinationDirectory))
                    {
                        BL_Documento.CrearDirectorio(DirectoryFiles);
                    }

                    // Copiar el archivo
                    System.IO.File.Copy(pathOCSource, pathOCDestiny, true);


                }

                if (G_H == "G")
                {
                    string filePathOrigen = string.Empty;
                    string sociedad = string.Empty;
                    string filePathDestino = string.Empty;

                    if (sociedadAjax1 == "1000")
                    {
                        sociedad = "SPM";
                    }
                    else if (sociedadAjax1 == "2000")
                    {
                        sociedad = "CMC";
                    }
                    else
                    {
                        sociedad = "AOM";
                    }

                    foreach (var ingreso in ingresoAsocList)
                    {
                        filePathOrigen = Path.Combine(UTI_VarGlobal.Constant.Path.OC, sociedad, ingreso + ".pdf");
                        filePathDestino = Path.Combine(DirectoryFiles, "GUIA_" + ingreso + ".pdf");
                        BL_Documento.CopiarPDF(filePathOrigen, filePathDestino);
                    }

                }
                else // H
                {
                    string filePathOrigen = string.Empty;
                    string filePathDestino = string.Empty;

                    foreach (var nro_hes in nroHesList)
                    {
                        filePathOrigen = Path.Combine(UTI_VarGlobal.Constant.Path.HES, nro_hes + ".pdf");
                        filePathDestino = Path.Combine(DirectoryFiles, "HES_" + nro_hes + ".pdf");
                        BL_Documento.CopiarPDF(filePathOrigen, filePathDestino);
                    }


                }

            }
            catch (Exception ex)
            {
                UTI_ExceptionTable.InsHandleError(ex, "Documento Controller -> UploadFiles -> Se procedio a anular el documento");
                //new UTI_Exception(ex.Message, "Document Controller -> UploadFiles");
                BL_Documento.AnularAdminDocumento(id_documento);
                return Json("No se pudo guardar los archivos, se anuló el registro.", JsonRequestBehavior.DenyGet);
            }

            return Json("Exito", JsonRequestBehavior.DenyGet);



        }

        [HttpPost]
        public ActionResult UpdObsDocumento(DTO_DocumentoCabecera CabDocumento)
        {
            return Json(BL_Documento.UpdObsDocumento(CabDocumento), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UpdAnuDocumento(DTO_DocumentoCabecera CabDocumento, string origen)
        {
            return Json(BL_Documento.UpdAnuDocumento(CabDocumento, origen), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UpdAprDocumento(DTO_DocumentoCabecera CabDocumento, string deGenRegSAP, string mensajeMIRO_FI)
        {
            var session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;

            //Session = false
            if (session == null)
            {
                return Json(new { session = false, resultado = "", mensajeMIRO_FI = mensajeMIRO_FI }, JsonRequestBehavior.DenyGet);
            }

            var resultado = BL_Documento.UpdAprDocumento(CabDocumento, deGenRegSAP);

            if (resultado.Type == "Exito")
            {
                if (deGenRegSAP == "S")
                {
                    mensajeMIRO_FI += Environment.NewLine + Environment.NewLine + " Se actualizaron los datos.";
                }
                else
                {
                    mensajeMIRO_FI += Environment.NewLine + " Se actualizaron los datos.";
                }

            }
            else
            {
                if (deGenRegSAP == "S")
                {
                    mensajeMIRO_FI += Environment.NewLine + Environment.NewLine + " No se puedieron actualizar los datos.";
                }
                else
                {
                    mensajeMIRO_FI += Environment.NewLine + " No se puedieron actualizar los datos.";
                }

            }

            return Json(new { session = true, resultado = resultado, mensajeMIRO_FI = mensajeMIRO_FI }, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult GetValidarMontoFactura(string moneda_OC, double monto_total_OC, double sub_total, string moneda)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }
            //return Json(BL_Documento.GetValidarMontoFactura(Session.UserName, moneda_OC, monto_total_OC, sub_total, moneda), JsonRequestBehavior.DenyGet);
            return Content(BL_Documento.GetValidarMontoFactura(Session.UserName, moneda_OC, monto_total_OC, sub_total, moneda));
        }

        [HttpPost]
        public ActionResult GetValidarFactura(string txtNroDocReg, string ruc)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }

            return Content(BL_Documento.GetValidarFactura(txtNroDocReg, ruc));
        }

        [HttpPost]
        public ActionResult GetEstadoDoc(string id_documento)
        {
            var session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;

            if (session == null)
            {
                return Json(new { Session = false }, JsonRequestBehavior.DenyGet);
            }

            var estado = BL_Documento.GetEstadoDoc(id_documento);
            return Json(new { session = true, estado = estado }, JsonRequestBehavior.DenyGet);

            //return Json(BL_Documento.GetEstadoDoc(id_documento), JsonRequestBehavior.DenyGet);
        }
         
        [HttpPost]
        public ActionResult GrabarArchivos(string paths, string pathsnew, string mensajeMIRO_FI, string IdDocument, string ruc, string xml)
        {

            var session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (session == null)
            {
                return Json(new { session = false, result = "", mensaje = mensajeMIRO_FI }, JsonRequestBehavior.DenyGet);
            }

            string ruta_file = UTI_VarGlobal.Constant.Path.FILE;
            string ruta_file_new = UTI_VarGlobal.Constant.Path.FILENEW;

            string fullPathT = Path.Combine(ruta_file, paths);

            bool isCopied = false;
            

            string fullPathTnew = Path.Combine(ruta_file_new, pathsnew);

            bool isPEP = false;

            
            var listaTotal = BL_Proveedor.GetProveedorAuditoria();
            var listaNombresRuc = listaTotal.Where(x => x.cRuc == ruc).OrderByDescending(x => x.ProveedorAuditoriaID).ToList();

            try
            {

                // PRIMERO CREASMOS LA CARPETA
                //PEP
                var SapbyDoc = BL_Documento.GetSapbyDoc(Int32.Parse(IdDocument));
                foreach (var item in SapbyDoc)
                {
                    var rptaPEP = NCO.PEP(item.nro_ingreso_sap, item.ano_registro, item.id_sociedad);

                    if (rptaPEP.ZPEP == "Tiene Elementos PEP")
                    {
                        isPEP = true;
                        break;
                    }

                }
               

                //AF
                var SapbyDocRow = SapbyDoc.FirstOrDefault();
                var rptaAF = NCO.AF(SapbyDocRow.nro_doc_oc, SapbyDocRow.ano_registro, SapbyDocRow.id_sociedad);


                if (rptaAF.ZCUENTA.Contains("Si tiene cuenta AF") && isPEP)
                {
                    //Crear el sufijo AF
                    fullPathTnew = fullPathTnew + "_AF";
                }

                if (isPEP)
                {
                    //Crear el sufijo PEP
                    fullPathTnew = fullPathTnew + "_PEP";
                }

                if (!Directory.Exists(fullPathTnew))
                {
                    BL_Documento.CrearDirectorio(fullPathTnew);
                }





                var parts = paths.Split('/');

                foreach (var nombre in listaNombresRuc)
                {
                    var newFilePath = "";
                    parts[4] = ruc + '-' + nombre.RazonSocialAnterior;
                    var newPath = string.Join("/", parts);
                    string newPathServer = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, newPath);
                    newFilePath = Path.Combine(newPathServer, "XML_" + xml);
                    if (System.IO.File.Exists(newFilePath))
                    {

                        if(!Directory.Exists(fullPathTnew))
                        {
                            BL_Documento.CrearDirectorio(fullPathTnew);
                        }

                        // Obtén todos los archivos de la carpeta de origen
                        string[] newFiles = Directory.GetFiles(newPathServer);


                        foreach (string file in newFiles)
                        {

                            string fileName = Path.GetFileName(file);
                            string destFile = Path.Combine(fullPathTnew, fileName);
                            System.IO.File.Copy(file, destFile, true);

                        }
                        isCopied = true;
                        break;
                    }

                }



                if (!isCopied)
                {
                    // Obtén todos los archivos de la carpeta de origen
                    string[] files = Directory.GetFiles(fullPathT);


                    foreach (string file in files)
                    {

                        string fileName = Path.GetFileName(file);
                        string destFile = Path.Combine(fullPathTnew, fileName);
                        System.IO.File.Copy(file, destFile, true);

                    }
                }
                

                mensajeMIRO_FI += "Los documentos electrónicos se cargaron correctamente.";
                return Json(new { session = true, result = "Exito", mensaje = mensajeMIRO_FI }, JsonRequestBehavior.DenyGet);

            }
            catch (Exception ex)
            {
                var logObject = new
                {
                    paths = paths,
                    pathsnew = pathsnew,
                    mensajeMIRO_FI = mensajeMIRO_FI,
                    IdDocument = IdDocument,
                    mensaje = "Inconvenientes para copiar archivos"
                };
                string jsonString = JsonConvert.SerializeObject(logObject, Formatting.Indented);
                BL_UTI_Exception.InsHandleError(ex, jsonString);

                //new UTI_Exception(ex, "Documento Controller -> GrabarArchivos");
                //mensajeMIRO_FI += "Inconvenientes para copiar archivos: " + ex.Message;
                mensajeMIRO_FI += "Inconvenientes para copiar archivos.";
                return Json(new { session = true, result = "Fail", mensaje = mensajeMIRO_FI }, JsonRequestBehavior.DenyGet);
            }


        }

        [HttpPost]
        public ActionResult ValidarAF(string IdDocument)
        {


            var session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (session == null)
            {
                return Json(new { session = false, result = "", mensaje = "" }, JsonRequestBehavior.DenyGet);
            }


            bool existAF = false;
            bool existPEP = false;

            try
            {

                
                //PEP
                var SapbyDoc = BL_Documento.GetSapbyDoc(Int32.Parse(IdDocument));
                foreach (var item in SapbyDoc)
                {
                    var rptaPEP = NCO.PEP(item.nro_ingreso_sap, item.ano_registro, item.id_sociedad);

                    if (rptaPEP.ZPEP == "Tiene Elementos PEP")
                    {
                        existPEP = true;
                        break;
                    }

                }


                //AF
                var SapbyDocRow = SapbyDoc.FirstOrDefault();
                var rptaAF = NCO.AF(SapbyDocRow.nro_doc_oc, SapbyDocRow.ano_registro, SapbyDocRow.id_sociedad);
                if (rptaAF.ZCUENTA.Contains("Si tiene cuenta AF"))
                {
                    if (existPEP)
                    {
                        //Crear el sufijo AF
                        existAF = true;
                        return Json(new { session = true, result = "Exito", mensaje = "" }, JsonRequestBehavior.DenyGet);
                    }
                    else
                    {
                        //Mensaje de error por mal generacion del AF
                        return Json(new { session = true, result = "Fail", mensaje = "Orden de Compra de Activo Fijo mal generada." }, JsonRequestBehavior.DenyGet);
                    }
                   
                }

                return Json(new { session = true, result = "Exito", mensaje = "" }, JsonRequestBehavior.DenyGet);

            }
            catch (Exception ex)
            {
                var logObject = new
                {
                    IdDocument = IdDocument,
                    mensaje = "Inconvenientes para validar el AF"
                };
                string jsonString = JsonConvert.SerializeObject(logObject, Formatting.Indented);
                BL_UTI_Exception.InsHandleError(ex, jsonString);

                //new UTI_Exception(ex, "Documento Controller -> GrabarArchivos");
                //mensajeMIRO_FI += "Inconvenientes para copiar archivos: " + ex.Message;
                
                return Json(new { session = true, result = "Fail", mensaje = "Error de Ajx" }, JsonRequestBehavior.DenyGet);
                
            }
        }

        [HttpPost]
        public ActionResult GetOCPendRegistered(string cod_proveedor, string nro_doc_oc, List<string> listNro_ingreso_sap, string GuiaOrHes, List<string> listaNro_Hes)
        {
            return Json(BL_Documento.GetOCPendRegistered(cod_proveedor, nro_doc_oc, listNro_ingreso_sap, GuiaOrHes, listaNro_Hes), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public async Task<ActionResult> Buscar_INGRESODET(string cod_documento, string nroOrdenCompra, string clase_OC, int chkAgregCuenMayo, string cuenta, string debeHaber, decimal importe, string impuesto, string centroCosto, int chk_Detra, string detrac, int chk_Fondo, string fondo, string txtFecha_Fac, string txtFecha_Reg, string txtNro_Doc, string sociedad, string moneda, decimal imp_total)
        //public async Task<ActionResult> Buscar_INGRESODET(string cod_documento, string sociedad)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }

            string ITEM_TEXT = Session.UserSAP;
            var xml_nuevo = BL_Documento.Buscar_INGRESODET(cod_documento, nroOrdenCompra, clase_OC, chkAgregCuenMayo, cuenta,
                                                 debeHaber, importe, impuesto, centroCosto, chk_Detra, detrac,
                                                 chk_Fondo, fondo, txtFecha_Fac, txtFecha_Reg, txtNro_Doc, sociedad, moneda,
                                                 imp_total, ITEM_TEXT);

            var responseData = await BL_Documento_MIRO.Genera_MIRO(xml_nuevo, nroOrdenCompra, cod_documento);
            responseData.sociedad = sociedad;

            var responseFinal = BL_Documento_MIRO.Genera_FI(responseData, cod_documento);
            
            //AQUI SI TIENE DATO GRABAR

            return Json(new
            {
                Doc_MIRO = responseFinal.Doc_MIRO != null ? responseFinal.Doc_MIRO : string.Empty,
                Doc_FI = responseFinal.Doc_FI != null ? responseFinal.Doc_FI : string.Empty,
                mensaje = responseFinal.PE_MESSAGE != null ? responseFinal.PE_MESSAGE : string.Empty
            }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public async Task<ActionResult> Buscar_INGRESODET_PRUEBA(string cod_documento, string nroOrdenCompra, string clase_OC, int chkAgregCuenMayo, string cuenta, string debeHaber, decimal importe, string impuesto, string centroCosto, int chk_Detra, string detrac, int chk_Fondo, string fondo, string txtFecha_Fac, string txtFecha_Reg, string txtNro_Doc, string sociedad, string moneda, decimal imp_total)
        
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }


            await Task.Delay(5000);

            return Json(new
            {
                Doc_MIRO = "5105699908",
                Doc_FI = "1900999631",
                mensaje = string.Empty
            }, JsonRequestBehavior.AllowGet);

        }


        [HttpPost]
        public ActionResult SendCorreoCambioEstado(int IdDocumento)
        {
            return Json(BL_Documento.SendCorreoCambioEstado(IdDocumento), JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult UpdComenSegui(int id_documento, string doc_miro_sap, string doc_fi_sap, string flag_doc_sap, string comen_segui)
        {
            return Json(BL_Documento.UpdComenSegui(id_documento, doc_miro_sap, doc_fi_sap, flag_doc_sap, comen_segui), JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult UpdAuditDocSet(int id_documento)
        {
            var Session = HttpContext.Session["AuthenticationIdentity"] as AuthenticationIdentity;
            if (Session == null)
            {
                return RedirectToAction("LogOut", "Login", new { area = "" });
            }

            var enUso = BL_Documento.ValidUsoDoc(id_documento);
            if (enUso.user_ver_doc != "")
            {
                if (enUso.user_ver_doc != Session.UserID)
                {
                    return Json(new { success = false, message = $"El documento ya está en uso por {enUso.user_ver_doc} desde {enUso.fec_ver_doc}" });
                }
            }

            BL_Documento.UpdAuditDocSet(id_documento, Session.UserID);
            return Json(new { success = true });
        }

        [HttpPost]
        public ActionResult UpdAuditDocUnSet(int id_documento)
        {
            return Json(BL_Documento.UpdAuditDocUnSet(id_documento), JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult ValidUsoDoc(int id_documento)
        {
            return Json(BL_Documento.ValidUsoDoc(id_documento), JsonRequestBehavior.DenyGet);
        }


        [HttpPost]
        public ActionResult AnularAdminDocumento(int id_documento, string title, string error)
        {
            BL_Documento.AnularAdminDocumento(id_documento);
            //new UTI_Exception("Entró al error del UploadFiles" + Environment.NewLine + "title: " + title +  Environment.NewLine + "error: " + error, "AnularAdminDocumento");
            BL_UTI_Exception.InsHandleError("Entró al error del UploadFiles" + Environment.NewLine + "title: " + title + Environment.NewLine + "error: " + error, "No se pudo guardar los adjuntos, se anuló el registro.");
            return Json("No se pudo guardar los adjuntos, se anuló el registro.", JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult FileUploadXmlCdrPdfTemp(string path, HttpPostedFileBase file, string prefijo, string mensajeRespuesta)
        {
            UTI_MsgResponse Response = new UTI_MsgResponse();
            Response.Title = Response.Title = UTI_MsgOperation.GetEnumDescription(UTI_MsgOperation.TituloMensaje.AssistantOperation);
            
            //string DirectoryFiles = string.Empty;
            
            if (file != null )
            {
                string baseTempPath = Path.Combine(Path.GetTempPath(), "Documento");
                
                if (!Directory.Exists(baseTempPath))
                    Directory.CreateDirectory(baseTempPath);

                string fullPath = Path.Combine(baseTempPath, prefijo + "_" + Path.GetFileName(file.FileName));

                file.SaveAs(fullPath);

                Response.Type = "Exito";
                Response.Description = mensajeRespuesta + " adjuntada con éxito";
            }
            else
            {
                Response.Type = "Error";
                Response.Description = "No se pudo adjuntar el " + mensajeRespuesta;
            }



            //if (file != null)
            //{
            //        DirectoryFiles = Path.Combine(UTI_VarGlobal.Constant.Path.FILE, path, "Temp");

            //    if (!Directory.Exists(DirectoryFiles)) { 
                
            //        Directory.CreateDirectory(DirectoryFiles);
            //    }

            //    DirectoryFiles = Path.Combine (DirectoryFiles, prefijo + "_" + file.FileName);
            //    file.SaveAs(DirectoryFiles);
            //    Response.Type = "Exito";
            //    Response.Description = mensajeRespuesta + " adjuntada con éxito";
            //}

            return Json(Response, JsonRequestBehavior.DenyGet);
        }



    }
}