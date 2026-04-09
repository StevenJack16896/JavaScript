/*/*const { func } = require("prop-types");*/

/*const { forEach } = require("core-js/es7/array");*/

/*const { I } = require("../../../Content/assets/libs/chart.js/chunks/helpers.segment");*/

/*const { string } = require("prop-types");*/

/*const { setTimeout } = require("timers");*/

/*const { CHAR_LEFT_PARENTHESES } = require("picomatch/lib/constants");*/

/*const { Body } = require("node-fetch");*/

/*const { result } = require("lodash");*/

/*const { uniq } = require("lodash");*/

/*const { config } = require("karma");*/

$(function () {

    //#region VariablesGlobales
    let currentIndex = 0; // Índice actual del paso
    let maxIndex = -1;
    

    let Fase11Registrado = "";
    let Fase12Observado = "";
    let Fase13Anulado = "";
    let Fase14RecibidoConforme = "";
    let Fase21FechaSAP = "";
    let Fase22NumeroSAP = "";
    let Fase31Fecha = "";
    let Fase31FechaSumada = "";
    let Fase41Fecha = "";
    let Fase42Banco = "";
    let Fase43Cuenta = "";
    let Fase44Moneda = "";
    let Fase45Importe = "";


    //validar los datos del XML
    
    let txtSubTotReg3Let = "";
    let cboMonDocRegLet = "";
    let txtNroDocRegLet = "";



    let Fase4NumeroPagos = "";

    let $rectangle2 = $('.rectangleTrancking2');

    let selectedFileXML;
    let selectedFileCDR;
    let selectedFilePDF;
    let selectedFilePDFSUS;

    var formDataAsociados = new FormData();
    let filesIngresAsoci = {};
    let NumRegDinamicPenSAP = 0;

    let currentDocumentId = null; // ID del documento actualmente en uso


    let sociedadAjax1 = "";

    var meses = [
        ['01', 'Enero'],
        ['02', 'Febrero'],
        ['03', 'Marzo'],
        ['04', 'Abril'],
        ['05', 'Mayo'],
        ['06', 'Junio'],
        ['07', 'Julio'],
        ['08', 'Agosto'],
        ['09', 'Setiembre'],
        ['10', 'Octubre'],
        ['11', 'Noviembre'],
        ['12', 'Diciembre']
    ];

    const optionsDetra = `
                    <option value = "08" > 08 - 4 % - madera</option>
                    <option value="09">09 - 10% - Arena y Piedra</option>
                    <option value="10">10 - 15% - Resid, subproduc y deserd</option>
                    <option value="11">11 - 10% - Bien grav IGV,renuncia exo</option>
                    <option value="12">12 - 12% - Intermediación laboral</option>
                    <option value="19">19 - 10% - Arrendamiento de Bienes</option>
                    <option value="20">20 - 12% - Mante y repara bien mueble</option>
                    <option value="21">21 - 10% - Movimiento de carga</option>
                    <option value="22">22 - 12% - Otros serv. empresariales</option>
                    <option value="24">24 - 10% - Comisión Mercantil</option>
                    <option value="25">25 - 10% - Serv. fabricac por encargo</option>
                    <option value="26">26 - 10% - Serv. transporte personas</option>
                    <option value="27">27 - 4% - Transporte de Bienes</option>
                    <option value="30">30 - 4% - Contratos de construcción</option>
                    <option value="31">31 - 10% - Oro gravado con el IGV</option>
                    <option value="34">34 - 10% - Mineral metal no aurífero</option>
                    <option value="35">35 - 1.5% - Bienes exonerados del IGV</option>
                    <option value="36">36 - 1.5% - Oro y demás min metal exon</option>
                    <option value="37">37 - 12% - Demás Servicios Gravados</option>
                    <option value="39">39 - 10% - Minerales no metálicos</option>
                    <option value="40">40 - 4% - Minerales no metálicos</option>
                `;

    const optionsGarant = `
                                <option value="F1">F1 - 5% - Fondo Garantía</option>
                               <option value="F2">F2 - 10% - Fondo Garantía</option>
                                <option value="F3">F3 - 4% - Fondo Garantía</option>
                `

    const optionsDH = `
                        <option value="S">S - Debe</option>
                        <option value="H">H - Haber</option>
                `;

    const optionsIndImp = `
                        <option Value="C0">C0 - 0% IGV - No Afecto</option>
                        <option Value="C1">C1 - 18% IGV - Compras</option>
                        <option Value="C2">C2 - 18% IGV - No Domiciliado</option>
                        <option Value="C8">C8 - 10% IGV - Compras</option>
                `;

    //#endregion VariablesGlobales

    const Documento = {
        _Init: function () {

            $('#title-menu').text('Documentos');
            $('#sub-title-menu').text('Buscar Documentos');
            $('#title-opcion').text('Documentos');


            $(document).ready(function () {
                $('.js-select2').select2();
            });


            Documento._FromDashBoard();

            Documento._FrmDocumentoBuscar();

            Documento._FrmDocumentoRegistrar();
            
            Documento._FrmModalProveedorBuscar();

            Documento._FrmModalTracking();



            //Modal de Mensajes
            $(document).on('keypress', function (e) {
                if (e.key === 'Enter') {
                    $("#btn-modal-close").click();
                }
            });
            

        },
        _Clear: {
            fnClearFilter: function () {

                if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Admin || $("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Logística) {
                    $('#hdcod_Proveedor').val('');
                    $('#txtProveedor').val('');
                } else {
                    $('#hdcod_Proveedor').val('');
                    $('#txtProveedor').val('');
                    $('#cboTipoDoc').val('01');
                    $('#txtNroDoc').val('');
                    $('#txtNroOrdenCompraBus').val('');
                    $('#cboSociedad').val('%');


                    $("#FechaDesdeReg").val($("#CurrentDate").val());
                    $("#FechaHastaReg").val($("#CurrentDate").val());
                    $('#cboEstados').val('%');

                    $('#chkDatosContab').prop('checked', false);
                    $('#cboClassOrden').val('%');
                    $('#cboMotAnul').val('%');
                }

               
                
                
                

            },

            fnUpdAuditDocUnSet: function () {

                if (currentDocumentId) {
                    $.ajax({
                        url: '/RRHH/Documento/UpdAuditDocUnSet',
                        type: 'POST',
                        data: { id_documento: currentDocumentId },
                        success: function () {
                            currentDocumentId = null; // Limpiar estado
                        },
                        error: function () {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Error al liberar el documento en uso.', Uti.Message.Type.Error);
                        }
                    });
                }
}

        },
        _Other: {
            fnTab: function () {
                /*$('.card-body ul li a[href="#tab-search"]').removeClass('disabled');*/
                /*$('.card-body ul li a[href="#tab-search"]').attr('data-bs-toggle', 'tab');*/
                $('.card-body ul li a[href="#tab-register"]').tab('show');

                $('#tab-register').scrollTop($('#tab-register')[0].scrollHeight);
                $('#ConformidadComentarioTxtArea').focus();

            },
            convertDateFormat: function (date) {
                // Verificar si la fecha tiene el formato correcto
                if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    // Dividir la fecha en partes
                    var parts = date.split('-');
                    var year = parts[0];
                    var month = parts[1];
                    var day = parts[2];

                    // Reordenar y devolver la fecha en formato DD/MM/YYYY
                    return day + '/' + month + '/' + year;
                } else {
                    // Devolver un mensaje de error si el formato no es correcto
                    return '';
                }
            },
            openPdfModal: function (pdfUrl) {
                // Limpiar el visor de PDF
                $('#pdfViewer').empty();

                // Cargar el PDF usando PDF.js
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                loadingTask.promise.then(function (pdf) {
                    // Mostrar la primera página del PDF en el visor
                    pdf.getPage(1).then(function (page) {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        // Renderizar la página PDF en el canvas
                        page.render(renderContext).promise.then(function () {
                            // Agregar el canvas al visor
                            $('#pdfViewer').append(canvas);
                        });
                    });
                }, function (reason) {
                    console.error(reason);
                });

                $('#ModalPDFPreview').modal('show');
                // Mostrar el modaly
            },
            fnChangeBoxIcon: function () {

                if ($("#layout-wrapper").hasClass("dark-mode")) {
                    $("#boxTracking").removeClass("custom-ri-box-3-line");
                    $("#boxTracking").addClass("custom-ri-box-3-line-dark");
                } else {
                    $("#boxTracking").removeClass("custom-ri-box-3-line-dark");
                    $("#boxTracking").addClass("custom-ri-box-3-line");
                }


            },
            fnGetMonthText: function (mesTexto) {

                // Si el texto tiene un solo dígito, le agregamos un '0' al inicio
                var mesString = mesTexto.length === 1 ? '0' + mesTexto : mesTexto;


                var mesEncontrado = meses.find(function (mes) {
                    return mes[0] === mesString;
                });

                // Retorna el nombre del mes o 'Mes no encontrado' si no existe
                return mesEncontrado ? mesEncontrado[1].toUpperCase() : 'Mes no encontrado';
                
            },
            fnConvertMontoStrToNumWithFormat: function (monto) {
                // Convertir a número
                const numero = parseFloat(monto);

                // Formatear con separador de miles y coma decimal
                const formato = numero.toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                return formato;

            }
           
        },
        _Data: {
            fnInsCabDocumento: function () {

                var listIngreAsoc = [];

                for (var i = 0; i < $(".AsociIngresxSAP").length; i++) {
                    var ingresoAsoc = {
                        IdDocumento: " ",
                        NroDocOC: $('#FromDashOC').val(),
                        ClaseIngresoDoc: "101",
                        NroIngresoSap: $(".AsociIngresxSAP td:nth-child(1)").eq(i)[0].innerHTML, //Ingreso SAP
                        PerAno: $(".AsociIngresxSAP td:nth-child(3)").eq(i)[0].innerHTML.split("/")[2], //Fecha de Contabilización	
                        FecIngreso: $(".AsociIngresxSAP td:nth-child(3)").eq(i)[0].innerHTML, //Fecha de Contabilización	
                        MonIngreso: $(".AsociIngresxSAP td:nth-child(4)").eq(i)[0].innerHTML, //Moneda
                        MontoIngreso: $(".AsociIngresxSAP td:nth-child(5)").eq(i)[0].innerHTML, //Importe Total
                        NroGuia: $(".AsociIngresxSAP td:nth-child(6)").eq(i)[0].innerHTML, //Guía o HES
                        NomAdjunto: $(".AsociIngresxSAP td:nth-child(9)").eq(i).find('.form-control.txtDetOrdComPDF').val(), // Puedes asignar el nombre del archivo adjunto aquí si es necesario
                        FecDoc: $(".AsociIngresxSAP td:nth-child(2)").eq(i)[0].innerHTML //Fecha de Documento
                    }
                    listIngreAsoc.push(ingresoAsoc);
                }
            
                // Obtener el valor de la etiqueta
                var FromDashNroHES = $("#FromDashNroHES").val();

                // Convertir el valor en una lista de strings
                var listaNroHes;

                if (FromDashNroHES.includes(',')) {
                    // Si tiene coma, dividir en un array
                    listaNroHes = FromDashNroHES.split(',');
                } else {
                    // Si es un solo valor, crear una lista con ese valor
                    listaNroHes = [FromDashNroHES];
                }

                const entityDto = {

                    //3.Datos de Documento Electronico
                    IdSociedad: $("#cboSociedadReg").val(),//
                    CieAno: $("#txtFecEmiReg").val().split("/")[2],//
                    CodProveedor: $("#FromDashProvReg").val(),//
                    TipoDoc: $("#cboTipDocReg").val(),//
                    NroDoc: $("#txtNroDocReg").val(),//
                    MontoDoc: $("#txtImpTotReg").val(),//
                    FecDoc: $("#txtFecEmiReg").val(),//
                    MonDoc: $("#cboMonDocReg").val(), //
                    FlagPdf: null,//
                    AdjuntoPdf: $("#txtPDFReg").val(),//
                    FlagXml: null,//
                    AdjuntoXml: $("#txtXMLReg").val(),//
                    FlagCdr: null,//
                    AdjuntoCdr: $("#txtCDRReg").val(),//
                    FlagVoboDoc: $('#chkConforReg').is(':checked') ? 'S' : '',//
                    FlagObsDoc: " ",//
                    ComenDoc: " ", //$("#ConformidadComentarioTxtArea").val(),//
                    //1.Datos de la OC
                    TipoDocOc: $("#cboClassOrdenReg").val(),//
                    NroDocOc: $("#txtNroOrdenReg").val(),//
                    EstDocOc: "ACT",//$("#cboEstadosReg").val(), // De Activo
                    FecEmiOc: $("#txtFecEmiReg").val(),//
                    MonOc: $("#txtMonedaReg").val(), //
                    MontoOc: $("#txtSubTotReg").val(),//
                    AdjuntoOc: $("#txtNroOrdenReg").val() + ".pdf",// Esta para verificar si existe o no
                    AdjuntoGuia: " ",//Se va a llenar en la tabla de ingresos por estar separados y ya no estará unificado en la cabecera.
                    EstDoc: $("#cboEstadosReg").val(),////"REG",//Estado
                    FecRegistro: $("#txtFecRegReg").val(),
                    SubtotalDoc: $("#txtSubTotReg3").val(),
                    //4.SAP
                    FlagDocSap: $('#chkConSAP').is(':checked') ? 'S' : 'N',
                    DocMiroSap: " ", //$("#txtNroDocMIRO").val(),
                    DocFiSap: " ", //$("#txtNroDocFI").val(),
                    EstObs: ' ',//Esto no llena el Proveedor   -->$("#cboMotObsReg").val(),//
                    UsuObserva: " ",//
                    FecObserva: " ",//
                    UsuAnula: " ",//
                    FecAnula: " ",//
                    UsuAprueba: " ",//
                    FecAprueba: " ",//
                    FlagDetra: $("#chkApliDetra").is(':checked') ? 'S' : ' ',//
                    CodDetra: $("#chkApliDetra").is(':checked') ? $("#cboTipoDetracc").val() : " ",
                    FlagFondo: $("#chkApliFondoGarant").is(':checked') ? 'S' : ' ',//
                    CodFondo: $("#chkApliFondoGarant").is(':checked') ? $("#cboTipoFondoGaranti").val() : " ",
                    FlagCuenta: $("#chkAgregCuenMayo").is(':checked') ? 'S' : ' ',
                    CodDebeHaber: $("#chkAgregCuenMayo").is(':checked') ? $("#cboDebeHaber").val() : " ",
                    MontoCuenta: $("#chkAgregCuenMayo").is(':checked') ? $("#txtDocContabImport").val() : " ",
                    CodImpuesto: $("#chkAgregCuenMayo").is(':checked') ? $("#cboIndiImpuest").val() : " ",
                    CodCebe: $("#chkAgregCuenMayo").is(':checked') ? $("#txtCentCosto").val() : " ",
                    CodCuenta: $("#chkAgregCuenMayo").is(':checked') ? $("#txtDocContabCuen").val() : " ",
                    ListIngreAsoc: listIngreAsoc,
                    GuiaOrHes: $("#FromDashGuiaOrHes").val(),
                    lista_NroHes: listaNroHes,
                    AdjuntoSustento: $("#txtPDFSUSReg").val()
                }

                // Retorna el objeto construido
                return entityDto;

            },

            fnInsCabDocumentoConDocAdjuntados: function () {

                var id_sociedad = $("#cboSociedadReg").val();
                var anio = $("#txtFecRegReg").val().split("/")[2];
                var mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                var fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');
                var ruc = $("#FromDashProvReg").val() + '-' + $("#FromDashRucFullName").val();
                var ruta_doc = $("#txtNroDocReg").val();

                var path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;



                var listIngreAsoc = [];

                for (var i = 0; i < $(".AsociIngresxSAP").length; i++) {
                    var ingresoAsoc = {
                        IdDocumento: " ",
                        NroDocOC: $('#FromDashOC').val(),
                        ClaseIngresoDoc: "101",
                        NroIngresoSap: $(".AsociIngresxSAP td:nth-child(1)").eq(i)[0].innerHTML, //Ingreso SAP
                        PerAno: $(".AsociIngresxSAP td:nth-child(3)").eq(i)[0].innerHTML.split("/")[2], //Fecha de Contabilización	
                        FecIngreso: $(".AsociIngresxSAP td:nth-child(3)").eq(i)[0].innerHTML, //Fecha de Contabilización	
                        MonIngreso: $(".AsociIngresxSAP td:nth-child(4)").eq(i)[0].innerHTML, //Moneda
                        MontoIngreso: $(".AsociIngresxSAP td:nth-child(5)").eq(i)[0].innerHTML, //Importe Total
                        NroGuia: $(".AsociIngresxSAP td:nth-child(6)").eq(i)[0].innerHTML, //Guía o HES
                        NomAdjunto: $(".AsociIngresxSAP td:nth-child(9)").eq(i).find('.form-control.txtDetOrdComPDF').val(), // Puedes asignar el nombre del archivo adjunto aquí si es necesario
                        FecDoc: $(".AsociIngresxSAP td:nth-child(2)").eq(i)[0].innerHTML //Fecha de Documento
                    }
                    listIngreAsoc.push(ingresoAsoc);
                }

                // Obtener el valor de la etiqueta
                var FromDashNroHES = $("#FromDashNroHES").val();

                // Convertir el valor en una lista de strings
                var listaNroHes;

                if (FromDashNroHES.includes(',')) {
                    // Si tiene coma, dividir en un array
                    listaNroHes = FromDashNroHES.split(',');
                } else {
                    // Si es un solo valor, crear una lista con ese valor
                    listaNroHes = [FromDashNroHES];
                }


                var UploadlistIngreAsoc = [];
                $(".AsociIngresxSAP").each(function () {
                    var ingresoSap = $(this).find("td:nth-child(1)").text().trim();
                    UploadlistIngreAsoc.push(ingresoSap);
                });

                var Uploadlistnrohes = [];
                $(".AsociIngresxSAP").each(function () {
                    var nroHes = $(this).find("td:nth-child(6)").text().trim();
                    Uploadlistnrohes.push(nroHes);
                });

                // Convertir arreglos a JSON
                
                


                const entityDto = {

                    CieAno: $("#txtFecEmiReg").val().split("/")[2],//Año Fecha de Emision(2,3)
                    CodProveedor: $("#FromDashProvReg").val(),// Proveedor Inicio de Sesion ID
                    FlagObsDoc: " ",//

                    
                    //1.Datos de la OC
                    NroDocOc: $("#txtNroOrdenReg").val(),//Nro Orden de Compra 1,1  
                    IdSociedad: $("#cboSociedadReg").val(),//1,2
                    TipoDocOc: $("#cboClassOrdenReg").val(),//Clase Orden 1,3
                    EstDocOc: "ACT",//$("#cboEstadosReg").val(), // De Activo
                    FecEmiOc: $("#txtNroOrdenCompra").val(),// 2,1
                    MonOc: $("#txtMonedaReg").val(), // Moneda 2,2
                    MontoOc: $("#txtSubTotReg").val(),// SubTotal 2,3
                    AdjuntoOc: $("#txtNroOrdenReg").val() + ".pdf",// Esta para verificar si existe o no Nombre del OC 3,1
                    AdjuntoGuia: " ",//Se va a llenar en la tabla de ingresos por estar separados y ya no estará unificado en la cabecera.


                    //2. Ingresos Asociados
                    ListIngreAsoc: listIngreAsoc,
                    GuiaOrHes: $("#FromDashGuiaOrHes").val(),
                    lista_NroHes: listaNroHes,
                    AdjuntoSustento: $("#txtPDFSUSReg").val(),
                    UserSUS: $("#txtPDFSUSReg").val(),
                    path: path,
                    UploadlistIngreAsoc: JSON.stringify(UploadlistIngreAsoc),
                    Uploadlistnrohes: JSON.stringify(Uploadlistnrohes),


                    //3.Datos de Documento Electronico
                    EstDoc: $("#cboEstadosReg").val(),////"REG",//Estado Siempre ss REG por ser inicio 1,2
                    FecRegistro: $("#txtFecRegReg").val(), // 1,3
                    TipoDoc: $("#cboTipDocReg").val(),// 2,1
                    NroDoc: $("#txtNroDocReg").val(),//2,2
                    FecDoc: $("#txtFecEmiReg").val(),//Fecha Emision 2,3
                    MonDoc: $("#cboMonDocReg").val(), //Moneda Documento 3,1
                    SubtotalDoc: $("#txtSubTotReg3").val(), //3,2
                    MontoDoc: $("#txtImpTotReg").val(),//Importe Total 3,3
                    FlagXml: null,//
                    AdjuntoXml: $("#txtXMLReg").val(),// 4,1
                    FlagCdr: null,//
                    AdjuntoCdr: $("#txtCDRReg").val(),// 4,2
                    FlagPdf: null,//
                    AdjuntoPdf: $("#txtPDFReg").val(),// 4,3
                    UserXML: $("#txtXMLReg").val(),
                    UserCDR: $("#txtCDRReg").val(),
                    UserPDF: $("#txtPDFReg").val(),


                    //4.Conformidad
                    FlagVoboDoc: $('#chkConforReg').is(':checked') ? 'S' : '',//
                    UsuObserva: " ",//
                    FecObserva: " ",//
                    UsuAnula: " ",//
                    FecAnula: " ",//
                    UsuAprueba: " ",//
                    FecAprueba: " ",//
                    EstObs: ' ',//Esto no llena el Proveedor   -->$("#cboMotObsReg").val(),//
                    ComenDoc: " ", //$("#ConformidadComentarioTxtArea").val(),//


                    //5.Documentos Contables - SAP
                    FlagDocSap: $('#chkConSAP').is(':checked') ? 'S' : 'N',
                    DocMiroSap: " ", //$("#txtNroDocMIRO").val(),
                    DocFiSap: " ", //$("#txtNroDocFI").val(),
                    FlagDetra: $("#chkApliDetra").is(':checked') ? 'S' : ' ',//
                    CodDetra: $("#chkApliDetra").is(':checked') ? $("#cboTipoDetracc").val() : " ",
                    FlagFondo: $("#chkApliFondoGarant").is(':checked') ? 'S' : ' ',//
                    CodFondo: $("#chkApliFondoGarant").is(':checked') ? $("#cboTipoFondoGaranti").val() : " ",
                    FlagCuenta: $("#chkAgregCuenMayo").is(':checked') ? 'S' : ' ',
                    CodCuenta: $("#chkAgregCuenMayo").is(':checked') ? $("#txtDocContabCuen").val() : " ",
                    CodDebeHaber: $("#chkAgregCuenMayo").is(':checked') ? $("#cboDebeHaber").val() : " ",
                    MontoCuenta: $("#chkAgregCuenMayo").is(':checked') ? $("#txtDocContabImport").val() : " ",
                    CodImpuesto: $("#chkAgregCuenMayo").is(':checked') ? $("#cboIndiImpuest").val() : " ",
                    CodCebe: $("#chkAgregCuenMayo").is(':checked') ? $("#txtCentCosto").val() : " ",
                    
                    
                    
                }

                // Retorna el objeto construido
                return entityDto;

            },

            fnUploadFiles: function()  {

                var id_sociedad = $("#cboSociedadReg").val();
                var anio = $("#txtFecRegReg").val().split("/")[2];
                var mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                var fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.') ;
                var ruc = $("#FromDashProvReg").val() + '-' + $("#FromDashRucFullName").val();
                var ruta_doc = $("#txtNroDocReg").val();


                let files = 0;
                for(var key in filesIngresAsoci) {
                    files = files + 1;
                    formDataAsociados.append('files' + files, filesIngresAsoci[key]);
                }

                formDataAsociados.append('path', id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc);

                formDataAsociados.append('OC', $("#txtNroOrdenReg").val());

                formDataAsociados.append('G_H', $("#FromDashGuiaOrHes").val());

                var UploadlistIngreAsoc = [];
                $(".AsociIngresxSAP").each(function () {
                    var ingresoSap = $(this).find("td:nth-child(1)").text().trim();
                    UploadlistIngreAsoc.push(ingresoSap);
                });

                var Uploadlistnrohes = [];
                $(".AsociIngresxSAP").each(function () {
                    var nroHes = $(this).find("td:nth-child(6)").text().trim();
                    Uploadlistnrohes.push(nroHes);
                });

                // Convertir arreglos a JSON
                formDataAsociados.append('Uploadlistnrohes', JSON.stringify(Uploadlistnrohes));
                formDataAsociados.append('UploadlistIngreAsoc', JSON.stringify(UploadlistIngreAsoc));
                formDataAsociados.append('sociedadAjax1', sociedadAjax1);
            }
        },
        _Modal: {
            fnProveedorOpen: function () {
                $('#modal-proveedor-buscar').modal('show');
            },
            fnProveedorClose: function () {
                $('#modal-proveedor-buscar').modal('hide');
            },
            fnPDFPreviewOpen: function () {
                $('#ModalPDFPreview').modal('show');
            },
            fnTrackingOpen: function () {
                $('#ModalTracking').modal('show');
            },
            fnMoveCircle: function (index) {

                const $lupaTracking = $('#lupaTracking');
                const $targetCircle = $(`#circle${index + 1}`);
                const rect = $targetCircle[0].getBoundingClientRect();
                const containerRect = $('.tracking-container')[0].getBoundingClientRect();

                // Calcular la posición izquierda del círculo movible
                const leftPosition = rect.left - containerRect.left + (rect.width / 2) - ($lupaTracking.outerWidth() / 2);

                $lupaTracking.css('left', `${leftPosition}px`); // Aplicar la posición calculada

            },
            fnMoveLeft: function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    Documento._Modal.fnMoveCircle(currentIndex);
                    Documento._Modal.fnDetalleFases(currentIndex);
                }
            },
            fnMoveRight: function () {
                if (currentIndex < 3 && currentIndex < maxIndex) {
                    currentIndex++;
                    Documento._Modal.fnMoveCircle(currentIndex);
                    Documento._Modal.fnDetalleFases(currentIndex);
                }
            },
            fnDetalleFases: function (currentIndex) {
                if (currentIndex == 0) {
                    $(".slider").css('display', 'none');
                    $(".msjTrancking").css('margin-bottom', '');

                    var iconElement = $('<i>').addClass('ri-send-plane-2-line');
                    $("#Label1").text(" ");
                    $('#Label1').append(iconElement);
                    $("#Label1").append(" Recepcionado:");
                    $("#Label1").css("display", "block");
                    $("#RespLabel1").css("display", "");
                    $("#RespLabel1").text(Fase11Registrado);


                    var iconElement2 = $('<i>').addClass('ri-eye-line');
                    $("#Label2").text(" ");
                    $('#Label2').append(iconElement2);
                    $("#Label2").append(" Observado:");
                    $("#Label2").css("display", "block");
                    $("#RespLabel2").css("display", "");
                    $("#RespLabel2").text(Fase12Observado);


                    var iconElement3 = $('<i>').addClass('ri-close-line');
                    $("#Label3").text(" ");
                    $('#Label3').append(iconElement3);
                    $("#Label3").append(" Anulado:");
                    $("#Label3").css("display", "block");
                    $("#RespLabel3").css("display", "");
                    $("#RespLabel3").text(Fase13Anulado);


                    var iconElement4 = $('<i>').addClass('ri-check-line');
                    $("#Label4").text(" ");
                    $('#Label4').append(iconElement4);
                    $("#Label4").append(" Recibido Conforme:");
                    $("#Label4").css("display", "block");
                    $("#RespLabel4").css("display", "");
                    $("#RespLabel4").text(Fase14RecibidoConforme);

                    $("#Label5").css("display", "none");
                    $("#RespLabel5").css("display", "none");


                    // Ajusta la altura del rectángulo con animación
                    $rectangle2.animate({ height: '230px' }, 300);

                } else if (currentIndex == 1) {
                    $(".slider").css('display', 'none');
                    $(".msjTrancking").css('margin-bottom', '');

                    var iconElement = $('<i>').addClass('ri-check-line');
                    $("#Label1").text(" ");
                    $('#Label1').append(iconElement);
                    $("#Label1").append(" Fecha:");
                    $("#Label1").css("display", "block");
                    $("#RespLabel1").css("display", "");
                    $("#RespLabel1").text(Fase21FechaSAP);

                    var iconElement2 = $('<i>').addClass('ri-hashtag');
                    $("#Label2").text(" ");
                    $('#Label2').append(iconElement2);
                    $("#Label2").append(" Número de Registro:");
                    $("#Label2").css("display", "block");
                    $("#RespLabel2").css("display", "");
                    $("#RespLabel2").text(Fase22NumeroSAP);

                    $("#Label3").css("display", "none");
                    $("#RespLabel3").css("display", "none");

                    $("#Label4").css("display", "none");
                    $("#RespLabel4").css("display", "none");

                    $("#Label5").css("display", "none");
                    $("#RespLabel5").css("display", "none");

                    $rectangle2.animate({ height: '120px' }, 300);

                } else if (currentIndex == 2) {
                    $(".slider").css('display', 'none');
                    $(".msjTrancking").css('margin-bottom', '');


                    var iconElement = $('<i>').addClass('ri-send-plane-2-line');
                    
                    $("#Label1").text(" ");
                    $('#Label1').append(iconElement);
                    $("#Label1").append(" Fecha Estimada de pago:");
                    $("#Label1").css("display", "block");
                    $("#RespLabel1").css("display", "");
                    $("#RespLabel1").text(Fase31FechaSumada);

                    $("#Label2").css("display", "none");
                    $("#RespLabel2").css("display", "none");

                    $("#Label3").css("display", "none");
                    $("#RespLabel3").css("display", "none");

                    $("#Label4").css("display", "none");
                    $("#RespLabel4").css("display", "none");

                    $("#Label5").css("display", "none");
                    $("#RespLabel5").css("display", "none");

                    $rectangle2.animate({ height: '65px' }, 300);

                } else {
                    $('.msjTrancking').css('margin-bottom', '0');
                    $('.slider').css('display', '');

                    $("#Label1").css("display", "none");
                    $("#RespLabel1").css("display", "none");

                    $("#Label2").css("display", "none");
                    $("#RespLabel2").css("display", "none");

                    $("#Label3").css("display", "none");
                    $("#RespLabel3").css("display", "none");

                    $("#Label4").css("display", "none");
                    $("#RespLabel4").css("display", "none");

                    $("#Label5").css("display", "none");
                    $("#RespLabel5").css("display", "none");

                    $(".slick-track").css("width", "");
                    $(".slick-slide.slick-current.slick-active").css("width", "580px");

                    $rectangle2.animate({ height: '315px' }, 300);

                }

            },

            fnfiltrarTabla: function() {
                var textoRUC = $('#txt-Modal-RUC').val().toLowerCase();
                var textoProveedor = $('#txt-Modal-Proveedor').val().toLowerCase();

                $('#list-proveedor tr').each(function () {
                    var ruc = $(this).find('td:nth-child(2)').text().toLowerCase();
                    var proveedor = $(this).find('td:nth-child(3)').text().toLowerCase();

                    // Mostrar la fila solo si ambos criterios coinciden
                    if (ruc.includes(textoRUC) && proveedor.includes(textoProveedor)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }

        },
        _Validation: {

            fnValidarSession: function (data) {
                if (data.includes("{")) {
                    // Intentar parsear el dato como JSON
                    const jsonObject = JSON.parse(data);

                    // Verificar si tiene la propiedad 'Session' (comprobación opcional)
                    if (jsonObject && jsonObject.hasOwnProperty('Session')) {
                        return jsonObject.Session;
                    }
                }

                return data; // Devuelve el objeto JSON parseado

            },
            fnGetValidarPDFAsociadoHES: function (nro_hes) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/GetPdfAsociadosHES',
                        type: 'POST',
                        xhrFields: {
                            responseType: 'blob'
                        },
                        async: true, // Esto es redundante porque async es true por defecto
                        cache: false,
                        data: {
                            nro_hes: nro_hes
                        },
                        success: function (resultado) {
                            if (resultado.Session == false) {
                                Uti.Modal.Message(resultado.Title, "Su Sesión ha expirado", resultado.Type, resultado.Function);
                                reject(new Error("Sesión expirada"));
                            } else {
                                resolve(resultado); // Resolver la promesa con el resultado
                            }
                        },
                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                            reject(error); // Rechazar la promesa en caso de error
                        }
                    });
                });
            },

            fnGetValidarPDFAsociadoGUIAS: function (nro_entrega) {

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/GetPdfAsociadosGUIAS',
                        type: 'POST',
                        xhrFields: {
                            responseType: 'blob'
                        },
                        async: true,
                        cache: false,
                        data: {
                            nro_entrega: nro_entrega,
                            nro_sociedad: $("#cboSociedadReg").val()
                        },
                        success: function (resultado) {
                            if (resultado.Session == false) {
                                Uti.Modal.Message(resultado.Title, "Su Sesión ha expirado", resultado.Type, resultado.Function);
                                reject(new Error("Sesión expirada"));
                            } else {
                                resolve(resultado); // Devuelve el resultado a la promesa
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('Error en fnGetValidarPDFAsociadoGUIAS:', error);
                            reject(error); // Rechaza la promesa en caso de error
                        }
                    });
                });

            },

            fnGetValidarMontoFactura: async function () {
                try {
                    const resultado = await $.ajax({
                        url: '/RRHH/Documento/GetValidarMontoFactura',
                        type: 'POST',
                        dataType: 'text', // Si devuelves una cadena de texto
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        data: {
                            moneda_OC: $("#txtMonedaReg").val(),
                            monto_total_OC: parseFloat($("#txtValTotIngReg").val()),
                            sub_total: parseFloat(txtSubTotReg3Let),  // parseFloat($("#txtSubTotReg3").val()),
                            moneda: cboMonDocRegLet //$("#cboMonDocReg").val()
                        }                        
                    });

                    Uti.Modal.Process(); // Cerrar el modal
                    return resultado;

                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);

                } finally {
                    Uti.Modal.Process(); // Cerrar el modal al finalizar
                }
            },

            fnGetValidarFactura: async function () {
                try {
                    const resultado = await $.ajax({
                        url: '/RRHH/Documento/GetValidarFactura',
                        type: 'POST',
                        dataType: 'text', // Si devuelves una cadena de texto
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        data: {
                            txtNroDocReg: txtNroDocRegLet, // $("#txtNroDocReg").val(),
                            ruc: $("#FromDashProvReg").val()
                            
                        }
                    });

                    Uti.Modal.Process(); // Cerrar el modal
                    return resultado;

                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);

                } finally {
                    Uti.Modal.Process(); // Cerrar el modal al finalizar
                }
            },


            fnGetValidarEstadoOC: function () {

                return new Promise((resolve, reject) => {

                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/GetEstadoDoc',
                        type: 'POST',
                        async: true,
                        cache: false,
                        data: { id_documento: $("#FromEyeIdDocument").val() },

                        beforeSend: function () {
                            Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);
                            $("#btn-Gen-Reg-SAP").prop('disabled', true);
                        },

                        success: (resultado) => {

                            $("#btn-Gen-Reg-SAP").prop('disabled', false);

                            const { session, estado } = resultado;

                            if (!session) {
                                Uti.Modal.Message( Uti.Message.Title.AssistantSession, "Se terminó el tiempo de sessión.", Uti.Message.Type.Alerta );
                                return resolve();   // termina la promise
                            }

                            if (!estado) return resolve();

                            if (estado === Uti.Variable.EstadoStatus.RecibidoConforme) {
                                if ($("#txtNroDocMIRO").val().length > 0 || $("#txtNroDocFI").val().length > 0) {
                                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Tiene un documento FI o MIRO, debe borrar o anular antes", Uti.Message.Type.Alerta );
                                    return resolve();
                                }

                                Documento._Operation.fnValidarAF()
                                    .then(r => {
                                        resolve(r);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });

                            } else {
                                Uti.Modal.Message( Uti.Message.Title.AssistantOperation, "El documento debe estar aprobado.", Uti.Message.Type.Alerta );
                                return resolve();
                            }

                        },
                        error: function (xhr, status, error) {
                            reject(error);
                        }
                    });

                });
            },



            fnGetOCPendRegistered: function () {

                // Obtener el valor de la etiqueta
                var FromDashNroEntregas = $("#FromDashNroEntregas").val();

                // Convertir el valor en una lista de strings
                var listaNroEntregas;

                if (FromDashNroEntregas.includes(',')) {
                    // Si tiene coma, dividir en un array
                    listaNroEntregas = FromDashNroEntregas.split(',');
                } else {
                    // Si es un solo valor, crear una lista con ese valor
                    listaNroEntregas = [FromDashNroEntregas];
                }

                // Obtener el valor de la etiqueta
                var FromDashNroHES = $("#FromDashNroHES").val();

                // Convertir el valor en una lista de strings
                var listaNroHes;

                if (FromDashNroHES.includes(',')) {
                    // Si tiene coma, dividir en un array
                    listaNroHes = FromDashNroHES.split(',');
                } else {
                    // Si es un solo valor, crear una lista con ese valor
                    listaNroHes = [FromDashNroHES];
                }



                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetOCPendRegistered',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cod_proveedor: $("#FromDashProv").val(),
                        nro_doc_oc: $("#FromDashOC").val(),
                        listNro_ingreso_sap: listaNroEntregas,
                        GuiaOrHes: $("#FromDashGuiaOrHes").val(),
                        listaNro_Hes: listaNroHes
                    },
                    //beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {
                            Uti.Modal.Process();
                            if (resultado !== "") {
                                                                                               
                                
                                Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Ya se realizó el registro, vuelva a registrar mediante el dashboard.", Uti.Message.Type.Alerta);
                                $("#btn-Subir-XML").prop('disabled', true);
                                $("#btn-Subir-CDR").prop('disabled', true);
                                $("#btn-Subir-PDF").prop('disabled', true);

                                $('#fileInputXML').prop('disabled', true);
                                $('#fileInputCDR').prop('disabled', true);
                                $('#fileInputPDF').prop('disabled', true);
                                $("#chkConforReg").prop('disabled', true);
                                $("#btn-Grabar").prop('disabled', true)
                                $('.trashIcon').off('click');
                                
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) {
                        Uti.Modal.Process();
                        
                    }
                });

            },

            fnMensajeValidacionAdjuntos: function () {
                let cambioEstado = 'N';
                let idDocumento = 0;

                let errorAdjuntoOC = false;
                let errorAdjuntoIngresoAsociado = false;
                let errorAdjuntoXML = false;
                let errorAdjuntoCDR = false;
                let errorAdjuntoPDF = false;

                var pasa = true;

                let textError = "No se encontraron los siguientes adjuntos:";

                textError += "<br>";
                if ($("#txtVerifyOC").val() == "") {
                    textError += "<li>";
                    textError += "La Orden de Compra: " + $("#txtNroOrdenReg").val();
                    textError += "</li>";
                    pasa = false;
                    errorAdjuntoOC = true;
                }
                
                for (var i = 0; i < $(".form-control.txtDetOrdComPDF").length; i++) {
                    var nodo = $(".form-control.txtDetOrdComPDF").eq(i).attr('idfileinput');
                    var namePDF = $(".form-control.txtDetOrdComPDF").eq(i).attr('namePDF');
                    if ($("#txtDetOrdComPDF" + nodo).val() == "") {
                        if (i == 0) {
                            textError += "<li>";
                            textError += "El Ingreso asociado: " + namePDF + ", ";
                        } else {
                            textError += namePDF;
                        }

                        pasa = false;
                        errorAdjuntoIngresoAsociado = true;
                    }
                }
                textError = textError.slice(0, -2);

                textError += "</li>";




                if ($("#txtXMLReg").val() == "") {
                    textError += "<li>";
                    textError += "El Doc. Electrónico - XML";
                    textError += "</li>";
                    pasa = false;
                    errorAdjuntoXML = true;
                }

                if ($("#txtCDRReg").val() == "") {
                    textError += "<li>";
                    textError += "El Doc. Electrónico - CDR o CPE";
                    textError += "</li>";
                    pasa = false;
                    errorAdjuntoCDR = true;
                }

                if ($("#txtPDFReg").val() == "") {
                    textError += "<li>";
                    textError += "El Doc. Electrónico - PDF";
                    textError += "</li>";
                    pasa = false;
                    errorAdjuntoPDF = true;
                }

                if (!errorAdjuntoOC && !errorAdjuntoIngresoAsociado && !errorAdjuntoXML && !errorAdjuntoCDR && !errorAdjuntoPDF) {
                    textError = "";
                }

                if (!$("#chkConforReg").is(':checked')) {
                    textError += "<br>";
                    textError += "Falta marcar la casilla de conformidad.";
                    pasa = false;
                }

                if ($(".form-control.txtDetOrdComPDF").length == 0) {
                    textError += "<br>";
                    textError += "No hay ingresos asociados por insertar.";
                    pasa = false;
                }

                var mensajes =  [];
                
                mensajes.pasa = pasa;
                mensajes.textError = textError;
                
                return mensajes;


            },

           


            fnValidUso: function () {

                var user_ver_doc = '';
                var fec_ver_doc = '';

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/ValidUsoDoc',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        id_documento: id_documento
                    },
                    beforeSend: function () { },
                    success: function (resultado) {
                        user_ver_doc = resultado.user_ver_doc;
                        fec_ver_doc = resultado.fec_ver_doc;
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });

                if (user_ver_doc != '') {
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, `Lo esta usando ${user_ver_doc }`, Uti.Message.Type.Error);
                }

            }
           
        },
        _Operation: {//Registro
            fnInsCabDocumento: function () {


                var pasa = Documento._Validation.fnMensajeValidacionAdjuntos().pasa;
            
                var textError = Documento._Validation.fnMensajeValidacionAdjuntos().textError;

                var data = Documento._Data.fnInsCabDocumento();              

                if (pasa) {

                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/InsCabDocumento',
                        type: 'POST',
                        contentType: 'application/json',
                        async: true,
                        cache: false,
                        data: JSON.stringify(data),
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        success: function (resultado) {

                            if (resultado.Session == false) {
                                Uti.Modal.Process();
                            }
                            if (resultado.Type == 'Exito') {
                                $("#btn-Grabar").prop('disabled', true);



                                cambioEstado = 'S'; //Se insertó correctamente

                                idDocumento = resultado.Additional;

                                formDataAsociados.delete('id_documento');
                                formDataAsociados.append('id_documento', idDocumento);

                                //Documento._Operation.fnUploadFiles(resultado.Description);//Veremos si sube los adjuntos correctamente.
                                Documento._Operation.fnUploadFiles(resultado.Description)
                                    .then(function () {
                                        Uti.Modal.Process();
                                        cambioEstado = 'S'; // solo si el detalle fue exitoso también
                                        Documento._Operation.fnSendCorreoCambioEstado(idDocumento);
                                    })
                                    //.catch(function (error) {
                                    //});


                                $("#btn-Subir-XML").prop('disabled', true);
                                $("#btn-Subir-CDR").prop('disabled', true);
                                $("#btn-Subir-PDF").prop('disabled', true);
                                $("#btn-Subir-PDF-SUS").prop('disabled', true);
                                $('.trashIcon').off('click');
                                $('#fileInputXML').prop('disabled', true);
                                $('#fileInputCDR').prop('disabled', true);
                                $('#fileInputPDF').prop('disabled', true);
                                $('#fileInputPDFSUS').prop('disabled', true);
                                $("#chkConforReg").prop('disabled', true);

                                Uti.Modal.Process();
                                
                            } else {
                                Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            }
                        },
                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        },
                        complete: function (complete) {
                            //Uti.Modal.Process();
                            //if (cambioEstado == 'S') {
                            //    Documento._Operation.fnSendCorreoCambioEstado(idDocumento);
                            //}
                        }
                    });
                }

                if (!pasa) {
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, textError , Uti.Message.Type.Error);
                }

            },

            fnInsCabDocumentoConDocAdjuntados: function () {


                var pasa = Documento._Validation.fnMensajeValidacionAdjuntos().pasa;
                var textError = Documento._Validation.fnMensajeValidacionAdjuntos().textError;

                var data = Documento._Data.fnInsCabDocumentoConDocAdjuntados();

                if (pasa) {

                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/InsCabDocumentoConDocAdjuntados',
                        type: 'POST',
                        contentType: 'application/json',
                        async: true,
                        cache: false,
                        data: JSON.stringify(data),
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        success: function (resultado) {

                            if (resultado.Session == false) {
                                Uti.Modal.Process();
                            }
                            if (resultado.Type == 'Exito') {
                                $("#btn-Grabar").prop('disabled', true);


                                //Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);


                                cambioEstado = 'S';
                                idDocumento = resultado.Additional;

                                //setTimeout(function () {
                                //Uti.Modal.Process();
                                formDataAsociados.append('id_documento', idDocumento);
                                //Documento._Operation.fnUploadFiles(resultado.Description);
                                //}, 2000);

                                $("#btn-Subir-XML").prop('disabled', true);
                                $("#btn-Subir-CDR").prop('disabled', true);
                                $("#btn-Subir-PDF").prop('disabled', true);
                                $("#btn-Subir-PDF-SUS").prop('disabled', true);
                                $('.trashIcon').off('click');
                                $('#fileInputXML').prop('disabled', true);
                                $('#fileInputCDR').prop('disabled', true);
                                $('#fileInputPDF').prop('disabled', true);
                                $('#fileInputPDFSUS').prop('disabled', true);
                                $("#chkConforReg").prop('disabled', true);



                            } else {
                                Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            }
                        },
                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        },
                        complete: function (complete) {
                            Uti.Modal.Process();
                            if (cambioEstado == 'S') {
                                Documento._Operation.fnSendCorreoCambioEstado(idDocumento);
                                //window.alert("envio correo");
                            }
                        }
                    });
                }

                if (!pasa) {
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, textError, Uti.Message.Type.Error);
                }
            },

            fnInsDocumentoIdentity: function () {
                //Este se usa para la insercion de la factura por el proveedor
                var pasa = Documento._Validation.fnMensajeValidacionAdjuntos().pasa;
                var textError = Documento._Validation.fnMensajeValidacionAdjuntos().textError;

                if (pasa) {

                    var data = Documento._Data.fnInsCabDocumentoConDocAdjuntados();


                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/InsDocumentoIdentity',
                        type: 'POST',
                        contentType: 'application/json',
                        async: true,
                        cache: false,
                        data: JSON.stringify(data),
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        success: function (resultado) {
                            const { Item1 : UTImensaje, Item2 : idDocumento } = resultado;

                            if (UTImensaje.Session == false) {
                                Uti.Modal.Process();
                            }
                            if (UTImensaje.Type == 'Exito') {
                                $("#btn-Grabar").prop('disabled', true);

                                var mensaje = `<ul>
                                                    <li>Los documentos electrónicos han sido ingresados y registrados correctamente, sin embargo aún no han sido aceptados para pago.</li>
                                                    <li>Tener en cuenta que los documentos tienen un plazo de validación de 48 horas para la revisión correspondiente.</li>
                                                </ul>
                                                `;

                                Uti.Modal.Message(Uti.Message.Title.AssistantOperation, mensaje, Uti.Message.Type.Alerta);


                                $("#btn-Subir-XML").prop('disabled', true);
                                $("#btn-Subir-CDR").prop('disabled', true);
                                $("#btn-Subir-PDF").prop('disabled', true);
                                $("#btn-Subir-PDF-SUS").prop('disabled', true);
                                $('.trashIcon').off('click');
                                $('#fileInputXML').prop('disabled', true);
                                $('#fileInputCDR').prop('disabled', true);
                                $('#fileInputPDF').prop('disabled', true);
                                $('#fileInputPDFSUS').prop('disabled', true);
                                $("#chkConforReg").prop('disabled', true);

                                Documento._Operation.fnSendCorreoCambioEstado(idDocumento);

                            } else {
                                Uti.Modal.Message(UTImensaje.Title, UTImensaje.Description, UTImensaje.Type, UTImensaje.Function);
                            }
                        },
                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        },
                        complete: function (complete) {
                            Uti.Modal.Process();
                        }
                    });

                }

                if (!pasa) {
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, textError, Uti.Message.Type.Error);
                }
            },


            fnUploadFiles: function (descripcion) {

                return new Promise(function (resolve, reject) {

                    Documento._Data.fnUploadFiles();

                        $.ajax({
                            url: Uti.Url.Base + '/RRHH/Documento/UploadFiles',
                            type: 'POST',
                            data: formDataAsociados,
                            processData: false,
                            contentType: false,
                            cache: true,
                            beforeSend: function () { /*Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);*/ },
                            success: function (resultado) {
                            
                                if (resultado.Session == false) {
                                    Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                                
                                }
                                if (resultado == 'Exito') {
                                    if (descripcion = "El registro ha sido insertado satisfactoriamente.") {
                                        var mensaje = `<ul>
                                                         <li>Los documentos electrónicos han sido ingresados y registrados correctamente, sin embargo aún no han sido aceptados para pago.</li>
                                                         <li>Tener en cuenta que los documentos tienen un plazo de validación de 48 horas para la revisión correspondiente.</li>
                                                        </ul>
                                                        `;
                                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, mensaje, Uti.Message.Type.Alerta);


                                    } else {
                                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, descripcion + " Los documentos electrónicos se cargaron correctamente. Los documentos aun no se han aceptado para pago. Validación de los documentos en 48 horas.", Uti.Message.Type.Alerta);
                                    }

                                    return resolve();
                                } else {
                                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, descripcion + " " + resultado, Uti.Message.Type.Alerta);
                                }
                            },
                            error: function (xhr, status, error) {
                                // Crear un parser para el HTML recibido
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(xhr.responseText, "text/html");

                                // Extraer el título
                                var title = doc.querySelector("title") ? doc.querySelector("title").innerText : "Error desconocido";

                                Documento._Operation.fnAnularAdminDocumento(formDataAsociados.get('id_documento'), title, error, descripcion);
                                
                                return reject(error);
                                //Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                            },
                            complete: function (complete) {
                                /*Uti.Modal.Process();*/
                            }
                        });

                });

            },

            fnUploadFilesConDocAdjuntados: function (descripcion) {

                var id_sociedad = $("#cboSociedadReg").val();
                var anio = $("#txtFecRegReg").val().split("/")[2];
                var mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                var fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');
                var ruc = $("#FromDashProvReg").val() + '-' + $("#FromDashRucFullName").val();
                var ruta_doc = $("#txtNroDocReg").val();


                let files = 0;
                for (var key in filesIngresAsoci) {
                    files = files + 1;
                    formDataAsociados.append('files' + files, filesIngresAsoci[key]);
                }

                formDataAsociados.append('path', id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc);

                formDataAsociados.append('OC', $("#txtNroOrdenReg").val());

                formDataAsociados.append('G_H', $("#FromDashGuiaOrHes").val());

                var UploadlistIngreAsoc = [];
                $(".AsociIngresxSAP").each(function () {
                    var ingresoSap = $(this).find("td:nth-child(1)").text().trim();
                    UploadlistIngreAsoc.push(ingresoSap);
                });

                var Uploadlistnrohes = [];
                $(".AsociIngresxSAP").each(function () {
                    var nroHes = $(this).find("td:nth-child(6)").text().trim();
                    Uploadlistnrohes.push(nroHes);
                });

                // Convertir arreglos a JSON
                formDataAsociados.append('Uploadlistnrohes', JSON.stringify(Uploadlistnrohes));
                formDataAsociados.append('UploadlistIngreAsoc', JSON.stringify(UploadlistIngreAsoc));
                formDataAsociados.append('sociedadAjax1', sociedadAjax1);


                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UploadFiles',
                    type: 'POST',
                    data: formDataAsociados,
                    processData: false,
                    contentType: false,
                    cache: true,
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);

                        }
                        if (resultado == 'Exito') {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, descripcion + " Los documentos electrónicos se cargaron correctamente. Los documentos aun no se han aceptado para pago. Validación de los documentos en 48 horas.", Uti.Message.Type.Alerta);
                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, descripcion + " " + resultado, Uti.Message.Type.Alerta);
                        }
                    },
                    error: function (xhr, status, error) {
                        // Crear un parser para el HTML recibido
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(xhr.responseText, "text/html");

                        // Extraer el título
                        var title = doc.querySelector("title") ? doc.querySelector("title").innerText : "Error desconocido";

                        Documento._Operation.fnAnularAdminDocumento(formDataAsociados.get('id_documento'), title, error, descripcion);
                        //Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });



            },

            fnUpdObsDocumento: function () {


                let cambioEstado = 'N';

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UpdObsDocumento',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        IdDocumento: $("#FromEyeIdDocument").val(),
                        EstDoc: $("#cboEstadosReg").val(),
                        EstObs: $("#cboMotObsReg").val(),
                        ComenDoc: $("#ConformidadComentarioTxtArea").val(),
                        UsuObserva: $("#FromDashUserID").val(),
                        DocMiroSap: $("#txtNroDocMIRO").val(),
                        DocFiSap: $("#txtNroDocFI").val(),
                        FlagDocSap: $("#chkConSAP").is(':checked') == true ? 'S' : 'N',
                        ComenSegui: $("#txt_seguimiento").val()
                        //FecObserva: Documento._Other.getCurrentDateTime()
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {

                            cambioEstado = 'S';


                            $("#btn-Grabar").prop('disabled',true);
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            $("#cboEstadosReg").empty().append('<option value="OBS">Observado</option>');
                            $("#cboEstadosReg").append('<option value="APR">Recibido Conforme</option>');
                            $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');

                            $("#DocContabl").css('display', 'none');
                        }

                        
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) {
                        Uti.Modal.Process();
                        if (cambioEstado == 'S') {
                            Documento._Operation.fnSendCorreoCambioEstado($("#FromEyeIdDocument").val());
                            //window.alert("envio correo");
                        }
                    }
                });

            },

            fnUpdAnuDocumento: function (cod_documento, busqueda) {

                let cambioEstado = 'N';

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UpdAnuDocumento',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        IdDocumento: cod_documento || $("#FromEyeIdDocument").val(),
                        EstObs: $("#cboMotObsReg").val(),
                        ComenDoc: $("#ConformidadComentarioTxtArea").val(),
                        EstDoc: Uti.Variable.EstadoStatus.Anulado, //"ANU",//$("#cboEstadosReg").val(),
                        UsuAnula: $("#FromDashUserID").val(),
                        DocMiroSap: $("#txtNroDocMIRO").val(),
                        DocFiSap: $("#txtNroDocFI").val(),
                        origen: busqueda,
                        FlagDocSap: $("#chkConSAP").is(':checked') == true ? 'S' : 'N' ,
                        ComenSegui: $("#txt_seguimiento").val()
                        //FecAnula: Documento._Other.getCurrentDateTime()
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        
                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {

                            if ($("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Proveedor) {
                                $("#cboEstadosReg").empty().append('<option value="ANU">Anulado</option>');
                                $("#cboEstadosReg").prop('disabled', true);
                            }

                            cambioEstado = 'S';
                            
                            $("#btn-Grabar").prop('disabled', true);
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }


                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) {
                        Uti.Modal.Process();
                        if (busqueda == 'S') {
                            $("#sbtnBuscar").click();
                        }
                        if (cambioEstado == 'S') {
                            Documento._Operation.fnSendCorreoCambioEstado(cod_documento);
                            //window.alert("envio correo");
                        }
                    }
                });

            },

            fnUpdAprDocumento: function (cod_documento, deGenRegSAP, FrommensajeMIRO_FI = '') {

                //deGenRegSAP Si actualiza por accion del Generar MIRO_FI
                //mensajeMIRO_FI es para cuando "deGenRegSAP = S" ya que genera MIRO_FI, actualiza y todo el mensaje se acumula para exponerlo en un solo modal.
                let cambioEstado = 'N';


                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UpdAprDocumento',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        IdDocumento: cod_documento,
                        EstDoc: Uti.Variable.EstadoStatus.RecibidoConforme, // // "APR",
                        FlagDocSap: $("#chkConSAP").is(':checked') ? 'S' : 'N',
                        DocMiroSap: $("#txtNroDocMIRO").val(),
                        DocFiSap: $("#txtNroDocFI").val(),
                        FlagDetra: $("#chkApliDetra").is(':checked') ? 'S' : 'N',
                        CodDetra: $("#cboTipoDetracc").val(),
                        FlagFondo: $("#chkApliFondoGarant").is(':checked') ? 'S' : 'N',
                        CodFondo: $("#cboTipoFondoGaranti").val(),
                        FlagCuenta: $("#chkAgregCuenMayo").is(':checked') ? 'S' : 'N',
                        CodCuenta: $("#txtDocContabCuen").val(),
                        CodDebeHaber: $("#cboDebeHaber").val(),
                        MontoCuenta: $("#txtDocContabImport").val(),
                        CodImpuesto: $("#cboIndiImpuest").val(),
                        CodCebe: $("#txtCentCosto").val(),                                                                                                                                                          
                        UsuAprueba: $("#FromDashUserID").val(),
                        ComenSegui: $("#txt_seguimiento").val(),
                        deGenRegSAP: deGenRegSAP,
                        mensajeMIRO_FI: FrommensajeMIRO_FI 
                        //FecAprueba: Documento._Other.getCurrentDateTime()
                    },
                    beforeSend: function () {
                        if (deGenRegSAP == "N") {
                            Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);
                        }
                    },
                    success: function (datos) {

                        // Destructuring nivel 1
                        const { session, resultado, mensajeMIRO_FI } = datos;

                        if (datos.Session === false) {
                            Uti.Modal.Message( Uti.Message.Title.AssistantSession, "Se terminó el tiempo de sesión, No se guardaron los datos en BD.", Uti.Message.Type.Alerta );
                            return;
                        }

                        if (!resultado) {
                            return;
                        }

                        cambioEstado = 'S';
                        $("#DocContabl").css('display', '');
                        $("#cboEstadosReg").empty().append('<option value="APR">Recibido Conforme</option>');
                        $("#cboEstadosReg").append('<option value="OBS">Observado</option>');
                        $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');
                        $("#FromEyesEstado").val("APR");
                        //$("#btn-Grabar").prop('disabled', true);
                        Uti.Modal.Message(resultado.Title, mensajeMIRO_FI.replace(/\r\n/g, '<br>'), resultado.Type, resultado.Function);
                        
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Error en la aprobación. " + Uti.Message.Description.ErrorAjax , Uti.Message.Type.Error);
                    },
                    complete: function (complete) {
                        Uti.Modal.Process();
                        if (deGenRegSAP == "N") {
                            if (cambioEstado == 'S') {
                                Documento._Operation.fnSendCorreoCambioEstado(cod_documento);
                                //window.alert("envio correo");
                            }
                        }
                        
                    }
                });


            },

            fnBuscar_INGRESODET: function () {

                return new Promise((resolve, reject) => {


                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/Buscar_INGRESODET',
                        type: 'POST',
                        async: true,
                        cache: false,
                        data: {
                            cod_documento: $("#FromEyeIdDocument").val(),

                            nroOrdenCompra: $("#txtNroOrdenReg").val(),
                            clase_OC: $("#cboClassOrdenReg").val(),

                            chkAgregCuenMayo: $("#chkAgregCuenMayo").is(':checked') ? 1 : 0,
                            cuenta: $("#txtDocContabCuen").val(),
                            debeHaber: $("#cboDebeHaber").val(),
                            importe: parseFloat($("#txtDocContabImport").val().replace(/,/g, '') || 0),

                            impuesto: $("#cboIndiImpuest").val(),
                            centroCosto: $("#txtCentCosto").val(),

                            chk_Detra: $("#chkApliDetra").is(':checked') ? 1 : 0,
                            detrac: $("#cboTipoDetracc").val(),


                            chk_Fondo: $("#chkApliFondoGarant").is(':checked') ? 1 : 0,
                            fondo: $("#cboTipoFondoGaranti").val(),

                            txtFecha_Fac: $("#txtFecEmiReg").val(),
                            txtFecha_Reg: $("#txtFecRegReg").val(),

                            txtNro_Doc: $("#txtNroDocReg").val(),

                            sociedad: $("#cboSociedadReg").val(),

                            moneda: $("#txtMonedaReg").val(),

                            imp_total: parseFloat($("#txtImpTotReg").val().replace(/,/g, '') || 0)
                        },
                        //beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        success: function (resultado) {
                            

                            if (resultado.Session == false) {
                                Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                                Uti.Modal.Process();
                                reject("Sesión expirada");
                                return;
                            }

                            if (!resultado) {
                                reject("Sin resultados");
                                return;
                            }


                            if (resultado.mensaje && resultado.mensaje.length > 0) {
                                Uti.Modal.Process();
                                Uti.Modal.Message(Uti.Message.Title.AssistantOperation, resultado.mensaje, Uti.Message.Type.Error);
                                reject(resultado.mensaje);
                                return;
                            }


                            // Todo correcto → resolvemos el resultado
                            resolve(resultado);

                        },
                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                            reject(error);
                        },
                        //complete: function (complete) { Uti.Modal.Process(); }
                    });


                });

            },

            fnDecryptParameter: function (encryptedParameter) {
                const bytes = CryptoJS.AES.decrypt(encryptedParameter, secretKey);
                return bytes.toString(CryptoJS.enc.Utf8);
            },



            fnValidarAF: function () {

                return new Promise((resolve, reject) => {

                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/ValidarAF',
                        type: 'POST',
                        async: true,
                        cache: false,
                        data: {
                            IdDocument: $("#FromEyeIdDocument").val()
                        },

                        success: function (resultado) {
                            
                            const { session, result, mensaje } = resultado;

                            // Sesión expirada
                            if (session == false) {
                                Uti.Modal.Message( Uti.Message.Title.AssistantOperation, "Su Sessión ha expirado...No se grabó ni se actualizaron los datos.", Uti.Message.Type.Alerta );
                                return resolve();
                            }

                            // Resultado exitoso
                            if (result === "Exito") {
                                debugger;
                                Documento._Operation.fnBuscar_INGRESODET()
                                    .then(det => {

                                        if (det.Doc_MIRO !== "" && det.Doc_FI !== "") {

                                            $("#btn-Gen-Reg-SAP").prop('disabled', true);

                                            $("#txtNroDocMIRO").val(det.Doc_MIRO);
                                            $("#txtNroDocFI").val(det.Doc_FI);

                                            return Documento._Operation.fnGrabarArchivos("")
                                                .then(grabArchi => {
                                                    resolve(grabArchi);
                                                })
                                                .catch(err => {
                                                    reject(err);
                                                });

                                        } else {
                                            Documento._Operation.fnUpdAprDocumento( $("#FromEyeIdDocument").val(), "S", det.mensaje );
                                        }
                                        resolve(det);  

                                    })
                                    .catch(err => {
                                        reject(err);
                                    });

                            }
                            else { //Tiene Error la O.C. por el AF
                                Uti.Modal.Message( AssistantOperation, mensaje, Uti.Message.Type.Alerta );
                                resolve(resultado); 
                            }
                        },

                        error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Error en validar el AF. " + Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                            reject(error);
                        }
                        
                    });

                });

            },



            fnGrabarArchivos: function (mensajeMIRO_FI) {

                return new Promise((resolve, reject) => {

                    var ruta_soc = $("#cboSociedadReg").val();
                    var ruta_ano = $("#txtFecRegReg").val().split("/")[2];
                    var mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                    var fecha_arch = $("#txtFecRegReg").val().split("/").join(".");
                    var tod_ruc = $("#FromSearchCabIdProvee").val() + '-' + $("#FromSearchCabRazonSocial").val();
                    var ruta_doc = $("#txtNroDocReg").val();
                    var ruta_doc_fi = $("#txtNroDocFI").val();
                    var ruta_mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);

                    var paths = [ruta_soc, ruta_ano, mes, fecha_arch, tod_ruc, ruta_doc].join("/");
                    var pathsnew = [ruta_soc, ruta_ano, ruta_mes, ruta_doc_fi].join("/");


                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/GrabarArchivos',
                        type: 'POST',
                        async: true,
                        cache: false,
                        data: {
                            paths: paths,
                            pathsnew: pathsnew,
                            mensajeMIRO_FI: mensajeMIRO_FI,
                            IdDocument: $("#FromEyeIdDocument").val(),
                            ruc: $("#FromSearchCabIdProvee").val(),
                            xml: $("#txtXMLReg").val()
                        },

                        success: function (resultado) {

                            const { session, result, mensaje } = resultado;

                            if (!session) {
                                Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Su sesión ha expirado...No se grabaron los archivos.", Uti.Message.Type.Alerta);
                                return resolve("Fin por sesión expirada");
                            }

                            if (result === "Exito") {
                                Documento._Operation.fnUpdAprDocumento( $("#FromEyeIdDocument").val(), "S", "Los documentos electrónicos se cargaron correctamente." );
                                return resolve(resultado);
                            }

                            // Si hay error lógico pero no técnico
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, mensaje + ", no se actualizaron los datos.", Uti.Message.Type.Alerta);
                            resolve(resultado);
                        },

                        error: function (xhr, status, error) {
                            Uti.Modal.Message( Uti.Message.Title.AssistantOperation, "Error en grabar archivos. " + Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error );
                            reject(error); // <-- Propagación real del error
                        }
                    });
                });
            },




            fnSendCorreoCambioEstado: function (cod_documento, cambioEstado) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/SendCorreoCambioEstado',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        IdDocumento: cod_documento
                    },
                    beforeSend: function () { },
                    success: function (resultado) {
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { }

                });
            },

            fnAnularAdminDocumento: function (id_documento, title, error, descripcion) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/AnularAdminDocumento',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        id_documento: id_documento,
                        title: title,
                        error: error
                    },
                    beforeSend: function () { },
                    success: function (resultado) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, resultado, Uti.Message.Type.Error);
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) {
                        Uti.Modal.Process();
                        Documento._Operation.fnSendCorreoCambioEstado(idDocumento);
                    }

                });
            },

            fnUpdAuditDocSet: function (id_documento) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UpdAuditDocSet',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        id_documento: id_documento
                    },
                    beforeSend: function () {},
                    success: function (resultado) {},
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { }
                });

            },
            fnUpdComenSegui: function () {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/UpdComenSegui',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        id_documento: $("#FromEyeIdDocument").val(),
                        doc_miro_sap: $("#txtNroDocMIRO").val(), //Viene vacío
                        doc_fi_sap: $("#txtNroDocFI").val(), //Viene vacío
                        flag_doc_sap: $("#chkConSAP").is(':checked') == true ? 'S':'N', //Llega N
                        comen_segui: $("#txt_seguimiento").val()
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        if (resultado.Session == false) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSession, "Se terminó el tiempo de sessión.", Uti.Message.Type.Alerta);
                            Uti.Modal.Process();
                        } else if (resultado == null) {

                        } else {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });
            },

            fnFileUploadXmlCdrPdfTemp: function (file, prefijo, mensajeRespuesta) {

                var id_sociedad = $("#cboSociedadReg").val();
                var anio = $("#txtFecRegReg").val().split("/")[2];
                var mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                var fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');
                var ruc = $("#FromDashProvReg").val() + '-' + $("#FromDashRucFullName").val();
                var ruta_doc = $("#txtNroDocReg").val();

                var path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc ;

                const formData  = new FormData();

                formData.append('path', path);
                formData.append('file', file);
                formData.append('prefijo', prefijo);
                formData.append('mensajeRespuesta', mensajeRespuesta);

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/FileUploadXmlCdrPdfTemp',
                    type: 'POST',
                    contentType: false,
                    data: formData ,
                    processData: false,
                    cache: true,
                    beforeSend: function () { Uti.Modal.Process('open'); },
                    success: function (resultado) {
                        Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                        if (resultado.Session == false) {
                            Uti.Modal.Process();
                        }
                        if (resultado.Type == 'Exito') {
                        }
                    },
                    error: function (error) { Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error); },
                    complete: function (complete) { Uti.Modal.Process(); }
                })
            }

        },

        _Search: {

            fnDocumentoSearch: function (idEyeDocumento) {

                //console.log("DATA QUE SE ENVÍA:", {
                //    CodProveedor: $('#hdcod_Proveedor').val(),
                //    TipoDoc: $('#cboTipoDoc').val(),
                //    NroDoc: $('#txtNroDoc').val(),
                //    FecDesdeRegistro: $("#FechaDesdeReg").val(),
                //    FecHastaRegistro: $("#FechaHastaReg").val(),
                //    FlagDocSap: $('#chkDatosContab').is(':checked') ? 'S' : 'N',
                //    TipoDocOc: $('#cboClassOrden').val(),
                //    MotivoAnulacion: $('#cboMotAnul').val(),
                //    IdSociedad: $('#cboSociedad').val(),
                //    NroDocOc: $('#txtNroOrdenCompraBus').val(),
                //    Estado: $('#cboEstados').val(),
                //    ProfileType: $("#FromDashUserProfileType").val()
                //}

             /*   );*/



                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetDocumentSearch',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        CodProveedor: $('#hdcod_Proveedor').val(),
                        TipoDoc: $('#cboTipoDoc').val(),
                        NroDoc: $('#txtNroDoc').val(),
                        FecDesdeRegistro: $("#FechaDesdeReg").val(),
                        FecHastaRegistro: $("#FechaHastaReg").val(),
                        FlagDocSap: $('#chkDatosContab').is(':checked') ? 'S' : 'N',
                        TipoDocOc: $('#cboClassOrden').val(),
                        MotivoAnulacion: $('#cboMotAnul').val(),
                        IdSociedad: $('#cboSociedad').val(),
                        NroDocOc: $('#txtNroOrdenCompraBus').val(),
                        Estado: $('#cboEstados').val(),
                        ProfileType: $("#FromDashUserProfileType").val()
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data) {
                 
                        if (data.Session == false) {
                            Uti.Modal.Message(data.Title, data.Description, data.Type, data.Function);
                            Uti.Modal.Process();
                        }
                        else if (data == null) {

                        } else {
                            $('#details-list-proveedor').html('');
                            var FromDashUserProfileType = $('#FromDashUserProfileType').val();



                            if (FromDashUserProfileType == Uti.Variable.ProfileType.Admin) {

                                for (var i = 0; i < data.length; i++) {
                                    //const Unique = data[i].NroDoc;
                                    //const Unique = data[i].IdDocumento;
                                    const Unique = data[i].idDocumento;
                                    const cod_proveedor = data[i].CodProveedor;


                                    let trackingIconHtml = $('#trackingIconTemplate').html().replace('UNIQUE_ID', Unique);

                                    let estadoDoc = "Recibido Conforme"

                                    let estObs = data[i].EstObs;
                                    let comenDoc = data[i].ComenDoc;

                                    if (data[i].EstDoc == "Recibido Conforme" ) {
                                        estObs = "";
                                        comenDoc = "";
                                    }


                                    
                                    


                                    if (data[i].EstDoc == "Anulado") {
                                        body = '<tr id=row-' + Unique + '>'
                                            + '<td class="text-center tachado">' + data[i].FecRegistro + '</td>'
                                            + '<td class="text-center tachado">' + data[i].FecDoc + '</td>' //Fecha de emisión por ser cabecera
                                            + '<td class="text-center tachado">' + data[i].CodProveedor + '</td>'
                                            + '<td class="text-center tachado">' + data[i].RazonSocial + '</td>'
                                            + '<td class="text-center tachado">' + data[i].IdSociedad + '</td>'
                                            + '<td class="text-center tachado">' + data[i].TipoDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].NroDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].MonDoc + '</td>'
                                            + '<td class="text-center tachado">' + Documento._Other.fnConvertMontoStrToNumWithFormat(data[i].MontoDoc) + '</td>'
                                            + '<td class="text-center tachado">' + data[i].TipoDocOc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].NroDocOc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].NroGuia + '</td>'
                                            + '<td class="text-center tachado">' + data[i].EstDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].DocMiroSap + '</td>'
                                            + '<td class="text-center tachado">' + data[i].DocFiSap + '</td>'
                                            + '<td class="text-center tachado">' + estObs + '</td>'
                                            + '<td class="text-center tachado" style="display: none;" >' + comenDoc + '</td>'
                                            + '<td class="text-center tachado" style="display: none;" >' + data[i].ComenSegui + '</td>'

                                    } else {
                                        body = '<tr id=row-' + Unique + '>'
                                            + '<td class="text-center">' + data[i].FecRegistro + '</td>'
                                            + '<td class="text-center">' + data[i].FecDoc + '</td>' //Fecha de emisión por ser cabecera
                                            + '<td class="text-center">' + data[i].CodProveedor + '</td>'
                                            + '<td class="text-center">' + data[i].RazonSocial + '</td>'
                                            + '<td class="text-center">' + data[i].IdSociedad + '</td>'
                                            + '<td class="text-center">' + data[i].TipoDoc + '</td>'
                                            + '<td class="text-center">' + data[i].NroDoc + '</td>'
                                            + '<td class="text-center">' + data[i].MonDoc + '</td>'
                                            + '<td class="text-center">' + Documento._Other.fnConvertMontoStrToNumWithFormat(data[i].MontoDoc) + '</td>'
                                            + '<td class="text-center">' + data[i].TipoDocOc + '</td>'
                                            + '<td class="text-center">' + data[i].NroDocOc + '</td>'
                                            + '<td class="text-center">' + data[i].NroGuia + '</td>'
                                            + '<td class="text-center">' + data[i].EstDoc + '</td>'
                                            + '<td class="text-center">' + data[i].DocMiroSap + '</td>'
                                            + '<td class="text-center">' + data[i].DocFiSap + '</td>'
                                            + '<td class="text-center">' + estObs + '</td>'
                                            + '<td class="text-center" style="display: none;" >' + comenDoc + '</td>'
                                            + '<td class="text-center" style="display: none;" >' + data[i].ComenSegui + '</td>'
                                    }



                                    body += '<td class="text-center"><a href="javascript:void(0);" id=slnkDocument' + Unique + ' name=slnkDocument' + Unique + ' ' + '" class="link-info" style="font-size: 30px"><i class="ri-eye-line"></i></a></td>'
                                         /*+ '<td class="text-center"><img src="../Content/assets/images/tracking.png" alt="Icono" id="slnkTracking' + Unique + '" name="slnkTracking' + Unique + '" style="width: 35px; height: 35px; margin-bottom: 10px; cursor: pointer;" ></td>'*/
                                         + '<td class="text-center">' + trackingIconHtml + '</td>'
                                         + '</tr>';

                                    $('#details-list-proveedor').append(body);

                                    if (idEyeDocumento>0) {
                                        $("#row-" + idEyeDocumento).addClass('fila-seleccionada');
                                    }

                                    // Delegar el evento en el contenedor de la tabla
                                    $('#details-list-proveedor').on('click', 'tr', function () {
                                        // Quitar el color de todas las filas
                                        $('#details-list-proveedor tr').removeClass('fila-seleccionada');

                                        // Agregar el color solo a la fila clickeada
                                        $(this).addClass('fila-seleccionada');
                                    });


                                    $('#details-list-proveedor #slnkDocument' + Unique).on('click', function () {
                                        Documento._Search.fnGetDetalleDocumento(Unique);
                                    });

                                    $('#details-list-proveedor #slnkTracking' + Unique).on('click', function () {
                                        Documento._Other.fnChangeBoxIcon();
                                        Documento._Search.fnGetTrackingDocProvee(cod_proveedor, Unique);
                                    });

                                    var img = $('#slnkTracking' + Unique);

                                    img.on('mouseover', function () {
                                        $(this).attr('src', '../Content/assets/images/trackingOscuro.png');
                                    });

                                    img.on('mouseout', function () {
                                        $(this).attr('src', '../Content/assets/images/tracking.png');
                                    });

                                }

                            } else {

                                for (var i = 0; i < data.length; i++) {
                                    //const Unique = data[i].NroDoc;
                                    const Unique = data[i].IdDocumento;
                                    const cod_proveedor = data[i].CodProveedor;

                                    let trashIconHtml = $('#trashIconTemplate').html().replace('UNIQUE_ID', Unique);
                                    let trackingIconHtml = $('#trackingIconTemplate').html().replace('UNIQUE_ID', Unique);

                                    let estadoDoc = "Recibido Conforme"

                                    let estObs = data[i].EstObs;
                                    let comenDoc = data[i].ComenDoc;

                                    if (data[i].EstDoc == "Recibido Conforme") {
                                        estObs = "";
                                        comenDoc = "";
                                    }



                                    if (data[i].EstDoc == "Anulado") {
                                        body = '<tr id=row-' + Unique + '>'
                                            + '<td class="text-center tachado">' + data[i].FecRegistro + '</td>'
                                            + '<td class="text-center tachado">' + data[i].FecDoc + '</td>'
                                            /*+ '<td class="text-center tachado">' + data[i].CodProveedor + '</td>'*/
                                            /*+ '<td class="text-center tachado">' + data[i].RazonSocial + '</td>'*/
                                            /*+ '<td class="text-center tachado">' + data[i].IdSociedad + '</td>'*/
                                            /*+ '<td class="text-center tachado">' + data[i].TipoDoc + '</td>'*/
                                            + '<td class="text-center tachado">' + data[i].NroDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].MonDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].MontoDoc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].TipoDocOc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].NroDocOc + '</td>'
                                            + '<td class="text-center tachado">' + data[i].NroGuia + '</td>'
                                            + '<td class="text-center tachado">' + data[i].EstDoc + '</td>'
                                            /*+ '<td class="text-center tachado">' + data[i].DocMiroSap + '</td>'*/
                                            + '<td class="text-center tachado">' + data[i].DocFiSap + '</td>'
                                            + '<td class="text-center tachado">' + estObs + '</td>'
                                            + '<td class="text-center tachado" style="display: none;" >' + comenDoc + '</td>'
                                    } else {
                                        body = '<tr id=row-' + Unique + '>'
                                            + '<td class="text-center">' + data[i].FecRegistro + '</td>'
                                            + '<td class="text-center">' + data[i].FecDoc + '</td>'
                                            /*+ '<td class="text-center">' + data[i].CodProveedor + '</td>'*/
                                            /*+ '<td class="text-center">' + data[i].RazonSocial + '</td>'*/
                                            /*+ '<td class="text-center">' + data[i].IdSociedad + '</td>'*/
                                            /*+ '<td class="text-center">' + data[i].TipoDoc + '</td>'*/
                                            + '<td class="text-center">' + data[i].NroDoc + '</td>'
                                            + '<td class="text-center">' + data[i].MonDoc + '</td>'
                                            + '<td class="text-center">' + data[i].MontoDoc + '</td>'
                                            + '<td class="text-center">' + data[i].TipoDocOc + '</td>'
                                            + '<td class="text-center">' + data[i].NroDocOc + '</td>'
                                            + '<td class="text-center">' + data[i].NroGuia + '</td>'
                                            + '<td class="text-center">' + data[i].EstDoc + '</td>'
                                            /*+ '<td class="text-center">' + data[i].DocMiroSap + '</td>'*/
                                            + '<td class="text-center">' + data[i].DocFiSap + '</td>'
                                            + '<td class="text-center">' + estObs + '</td>'
                                            + '<td class="text-center" style="display: none;" >' + comenDoc + '</td>'
                                    }
                                    
                                    body += '<td class="text-center"><a href="javascript:void(0);" id=slnkDocument' + Unique + ' name=slnkDocument' + Unique + ' ' + ' class="link-info" style="font-size: 30px"><i class="ri-eye-line"></i></a></td>'
                                          /*+ '<td class="text-center"><img src="../Content/assets/images/tracking.png" alt="Icono" id="slnkTracking' + Unique + '" name="slnkTracking' + Unique + '" style="width: 35px; height: 35px; margin-bottom: 10px; cursor: pointer;" ></td>'*/
                                          + '<td class="text-center">' + trackingIconHtml + '</td>'
                                          /*+ '<td class="text-center"><a href="javascript:void(0);" id=slnkButton' + Unique + ' name=slnkButton' + Unique + ' ' + '" class="link-info" style="font-size: 30px"><i class="mdi-trash-can"></i></a></td>'*/

                                    if (data[i].EstDoc == "Observado" ) {
                                        /*body += '<td class="text-center">' + $('#trashIconTemplate').html() + '</td>'*/
                                        body += '<td class="text-center">' + trashIconHtml + '</td>'
                                    } else {
                                        body += '<td class="text-center"></td>'
                                    }
                                    body += '</tr>';

                                    $('#details-list-proveedor').append(body);

                                    if (idEyeDocumento > 0) {
                                        $("#row-" + idEyeDocumento).addClass('fila-seleccionada');
                                    }

                                    // Delegar el evento en el contenedor de la tabla
                                    $('#details-list-proveedor').on('click', 'tr', function () {
                                        // Quitar el color de todas las filas
                                        $('#details-list-proveedor tr').removeClass('fila-seleccionada');

                                        // Agregar el color solo a la fila clickeada
                                        $(this).addClass('fila-seleccionada');
                                    });



                                    $('#details-list-proveedor #slnkDocument' + Unique).on('click', function () {
                                        $("#DocContabl").css('display', 'none');
                                        Documento._Search.fnGetDetalleDocumento(Unique);
                                        
                                    });

                                    $('#details-list-proveedor #slnkTracking' + Unique).on('click', function () {
                                        Documento._Other.fnChangeBoxIcon();
                                        Documento._Search.fnGetTrackingDocProvee(cod_proveedor, Unique);
                                    });

                                    var img = $('#slnkTracking' + Unique);

                                    img.on('mouseover', function () {
                                        $(this).attr('src', '../Content/assets/images/trackingOscuro.png');
                                    });

                                    img.on('mouseout', function () {
                                        $(this).attr('src', '../Content/assets/images/tracking.png');
                                    });


                                    $('#details-list-proveedor #slnkTrash' + Unique).on('click', function () {
                                        Documento._Operation.fnUpdAnuDocumento(Unique, 'S');
                                        Documento._Search.fnDocumentoSearch(0);
                                    });
                                    


                                }
                            }




                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.responseText.includes("maxJsonLength")) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Consulta muy amplia. Favor acortar la consulta.", Uti.Message.Type.Error);
                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        }
                        
                    },

                    complete: function (complete) { Uti.Modal.Process(); }
                });
            },

            fnGetProveedor() {
                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetProveedorAll',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {},
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                        let body = '';
                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        if (resultado.length > 0) {

                            Documento._Modal.fnProveedorOpen();
                            $('#list-proveedor').html('');

                            for (i = 0; i < resultado.length; i++) {
                                const property = 'cod_prov="' + resultado[i].Value + '" nom_prov="' + resultado[i].Label + '"';
                                body += '<tr>'
                                    + '<td>'
                                    + '<div class="form-check form-switch-success">'
                                    + '<input class="form-check-input checkbox-proveedor" type="checkbox" name="chkOpcion" ' + property + ' style="height:25px;width:25px">'
                                    + '</div >'
                                    + '</td > '
                                    + '<td>' + resultado[i].Value + '</td>'
                                    + '<td>' + resultado[i].Label + '</td>'
                                    + '</tr>';
                            }

                            $('#list-proveedor').append(body);

                            $('.checkbox-proveedor').on('click', function () {
                                $('.checkbox-proveedor').not(this).prop('checked', false);
                            });

                        }
                        else {
                            body = '<tr><td colspan=3 class="text-center">No se encontraron resultados</td></tr>';
                        };
                        
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });
            },

            fnGetDetalleDocumento: function (cod_documento) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetDetalleDocumento',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cod_documento: cod_documento
                    },
                    beforeSend: function () {
                        //console.log('Entrando en beforeSend');
                        //Documento._Operation.fnUpdAuditDocSet(cod_documento);
                        Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);
                    },
                    success: function (resultado) {
                        
                        
                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        } else {

                            $("#FromEyesEstado").val(resultado[0].est_doc);

                            $("#FromSearchCabIdProvee").val(resultado[0].cod_proveedor);
                            $("#FromSearchCabRazonSocial").val(resultado[0].RazonSocialProveedor);

                            $("#FromEyesMotObs").val(resultado[0].est_obs);
                            $("#FromEyesComent").val(resultado[0].comen_doc);
                            
                            $("#FromEyeIdDocument").val(cod_documento);
                           

                            Documento._Other.fnTab();
                            $('#txtNroOrdenReg').val(resultado[0].nro_doc_oc);
                            $('#txtNroOrdenReg').prop('disabled',true);

                            $('#cboSociedadReg').val(resultado[0].Id_sociedad);
                            $('#cboSociedadReg').prop('disabled',true );

                            $('#cboClassOrdenReg').val(resultado[0].tipo_doc_oc);
                            $('#cboClassOrdenReg').prop('disabled', true);

                            $('#txtNroOrdenCompra').val(resultado[0].fec_emi_oc);
                            $('#txtMonedaReg').val(resultado[0].mon_doc);

                            $('#txtSubTotReg').val(Documento._Other.fnConvertMontoStrToNumWithFormat(resultado[0].subtotal_doc));
                            
                            
                            

                            var MontoTotal = 0;
                            $('#details-list-documento-reg').html('');
                            $("#AnularDet").css("display", "none");
                            $("#btnsSubirXmlCdrPdf").css("display", "none");

                            //Porque como ya se registro ya no hay opción de volver a subir un sustento
                            $("#btn-Subir-PDF-SUS").css('display', 'none');
                            $("#fileInputPDFSUS").css('display', 'none');

                            $("#txtPDFSUSReg").css('display', '');
                            $("#txtPDFSUSReg").prop('disabled', true);


                            for (var i = 0; i < resultado.length; i++) {
                                const prop = " IdfileInput=" + i + " ";
                                const propAdjun = " nom_adjunto=" + resultado[i].nom_adjunto + " ";
                                let numeroAdjunto = "";
                                MontoTotal += parseFloat(resultado[i].monto_ingreso);
                                MontoTotal = parseFloat(MontoTotal.toFixed(2));
                                body = '<tr>'
                                    + '<td class="text-center">' + resultado[i].nro_ingreso_sap + '</td>' //Ingreso SAP
                                    + '<td class="text-center">' + resultado[i].fec_doc_det + '</td>' //Fecha de Documento
                                    + '<td class="text-center">' + resultado[i].fec_ingreso + '</td>' //Fecha de Contabilización
                                    + '<td class="text-center">' + resultado[i].mon_ingreso + '</td>' //Moneda
                                    + '<td class="text-center">' + Documento._Other.fnConvertMontoStrToNumWithFormat(resultado[i].monto_ingreso) + '</td>' //Importe Total
                                    + '<td class="text-center">' + resultado[i].nro_guia + '</td>' //Guia/HES
                                    /*+ '<td class="text-center"><a href="javascript:void(0);" id=slnkNroUniquedet' + resultado[0].id_documento + ' name=slnkNroUniquedet' + resultado[0].id_documento + ' " class="link-info" style="font-size: 30px"><i class="ri-close-line" style="color:red;"></i></a></td>'*/

                                if ($('#cboClassOrdenReg').val() == "ZNB" || $('#cboClassOrdenReg').val() == "ZSUB") {  //GUIAS
                                    numeroAdjunto = resultado[i].nro_ingreso_sap;
                                    body +=  '<td class="text-center"><a href="javascript:void(0);" id=slnkAdjDetdet' + resultado[i].nro_ingreso_sap + ' name=slnkAdjDetdet' + resultado[i].nro_ingreso_sap + propAdjun + ' " class="link-info" style="font-size: 30px"><i class="custom-ri-pdf-2-line-red"></i></a></td>'
                                } else {
                                    numeroAdjunto = resultado[i].nro_guia
                                    body += '<td class="text-center"><a href="javascript:void(0);" id=slnkAdjDetdet' + resultado[i].nro_guia + ' name=slnkAdjDetdet' + resultado[i].nro_guia + propAdjun + ' " class="link-info" style="font-size: 30px"><i class="custom-ri-pdf-2-line-red"></i></a></td>'
                                }

                                body += '<td> <input type = "text" class="form-control txtDetOrdComPDFDoc" id=txtDetOrdComPDFDoc' + i + prop + 'name="txtDetOrdComPDFDoc" Value="' + resultado[i].nom_adjunto+'" disabled ></td>'
                                        + '</tr>';

                                $('#details-list-documento-reg').append(body);
                                //$("#NombPDF").css('display', 'none');
                                $("#GuiaorHesReg").text("Guías/HES");
                                
                                $("#slnkAdjDetdet" + numeroAdjunto).on('click', function () {
                                    const nom_adjunto = numeroAdjunto + ".pdf";
                                    const id_sociedad = $("#cboSociedadReg").val();
                                    const anio = $("#txtFecRegReg").val().split("/")[2];
                                    const mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                                    const fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');
                                    //const ruc = $("#FromDashProvReg").val() + '-' + $("#FromDashRucFullName").val();

                                    let razonSocial = $("#FromSearchCabRazonSocial").val();
                                    // Eliminar el punto al final si existe
                                    razonSocial = razonSocial.endsWith('.') ? razonSocial.slice(0, -1) : razonSocial;

                                    const ruc = $("#FromSearchCabIdProvee").val() + '-' + razonSocial;
                                    const ruta_doc = $("#txtNroDocReg").val();

                                    const path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;

                                    if ($('#cboClassOrdenReg').val() == "ZNB" || $('#cboClassOrdenReg').val() == "ZSUB" )  //GUIAS
                                    {
                                        Documento._Search.fnGetPDF($("#txtNroOrdenReg").val(), nom_adjunto, path, "G", $("#FromSearchCabIdProvee").val());
                                    } else {
                                        Documento._Search.fnGetPDF($("#txtNroOrdenReg").val(), nom_adjunto, path, "H", $("#FromSearchCabIdProvee").val());
                                    }

                                    

                                });

                                if (resultado[i].nom_adjunto !== "") {
                                    $("#ArquiPDFAntiguo").css('display', 'none');
                                } else {
                                    $("#ArquiPDFAntiguo").css('display', 'none');
                                }
                            }

                           
                            $("#txtPDFSUSReg").val(resultado[0].adjunto_sustento);
                            $("#btn-Subir-SUS-Cab").show();


                            

                            $('#txtValTotIngReg').val(Documento._Other.fnConvertMontoStrToNumWithFormat(MontoTotal));
                            
                            $('#txtIngReg').val(resultado[0].adjunto_guia);

                            
                            $('#cboTipDocReg').val(resultado[0].tipo_doc);
                            $('#cboTipDocReg').prop('disabled', true);

                            $('#cboMonDocReg').val(resultado[0].mon_doc);
                            $('#cboMonDocReg').prop('disabled', true);

                            $('#txtXMLReg').val(resultado[0].adjunto_xml);

                            $('#cboEstadosReg').val(resultado[0].est_doc);
                            $('#cboEstadosReg').prop('disabled', true);


                            $('#txtNroDocReg').val(resultado[0].nro_doc);

                            $('#txtSubTotReg3').val(Documento._Other.fnConvertMontoStrToNumWithFormat(resultado[0].subtotal_doc));


                            $('#txtCDRReg').val(resultado[0].adjunto_cdr);

                            $('#txtFecRegReg').val(resultado[0].fec_registroDate);
                            $('#txtFecEmiReg').val(resultado[0].fec_doc);
                            $('#txtImpTotReg').val(Documento._Other.fnConvertMontoStrToNumWithFormat(resultado[0].monto_doc));



                            $('#txtPDFReg').val(resultado[0].adjunto_pdf);


                            $("#chkConforReg").prop('checked', (resultado[0].flag_vobo_doc == "S") ? true : false);
                            if (resultado[0].flag_vobo_doc == "S") {
                                $('#chkConforReg').prop('disabled', true);
                            }

                            //$("#chkConSAP").prop('checked', (resultado[0].flag_doc_sap == "S") ? true : false);

                            const resultadoFlagSAP = resultado[0].flag_doc_sap === "S";
                            

                            $("#chkConSAP").prop('checked', resultadoFlagSAP);
                            

                            

                            if (resultado[0].flag_doc_sap == "S") {
                                $('#chkConSAP').prop('disabled', true);
                            } else {
                                $('#chkConSAP').prop('disabled', false);
                            }





                            let est_obs = resultado[0].est_obs;
                            let comen_doc = resultado[0].comen_doc;

                            if (resultado[0].est_doc == Uti.Variable.EstadoStatus.RecibidoConforme) {
                                est_obs = "";
                                comen_doc = "";
                            }

                            
                            
                            $('#cboMotObsReg').val(est_obs);
                            $('#cboMotObsReg').prop('disabled', true);

                            $('#ConformidadComentarioTxtArea').val(comen_doc);
                            $('#ConformidadComentarioTxtArea').prop('disabled', true);


                            $("#txtNroDocMIRO").val(resultado[0].doc_miro_sap);
                            $("#txtNroDocFI").val(resultado[0].doc_fi_sap);


                            $("#chkApliDetra").prop('checked', (resultado[0].flag_detra == "S") ? true : false);
                            if ( $("#chkApliDetra").is(':checked') ) {
                                $('#cboTipoDetracc').html(optionsDetra).prop('disabled', false);
                                $("#cboTipoDetracc").val(resultado[0].cod_detra);
                            } else {
                                $('#cboTipoDetracc').html('').prop('disabled', true);
                            }

                            
                            $("#chkApliFondoGarant").prop('checked', (resultado[0].flag_fondo == "S") ? true : false);
                            if ($("#chkApliFondoGarant").is(':checked')) {
                                $('#cboTipoFondoGaranti').html(optionsGarant).prop('disabled', false);
                                $("#cboTipoFondoGaranti").val(resultado[0].cod_fondo);
                            } else {
                                $('#cboTipoFondoGaranti').html('').prop('disabled', true);
                            }


                            $("#chkAgregCuenMayo").prop('checked', (resultado[0].flag_cuenta == "S") ? true : false);
                            if ($("#chkAgregCuenMayo").is(':checked')) {

                                $("#txtDocContabCuen").prop('disabled', false);
                                $('#cboDebeHaber').html(optionsDH).prop('disabled', false);
                                $("#txtDocContabImport").prop('disabled', false);
                                $("#cboIndiImpuest").html(optionsIndImp).prop('disabled', false);
                                $("#txtCentCosto").prop('disabled', false);

                                $("#txtDocContabCuen").val(resultado[0].cod_cuenta);
                                $("#cboDebeHaber").val(resultado[0].cod_debe_haber);
                                $("#txtDocContabImport").val(Documento._Other.fnConvertMontoStrToNumWithFormat(resultado[0].monto_cuenta));



                                $("#cboIndiImpuest").val(resultado[0].cod_impuesto);
                                $("#txtCentCosto").val(resultado[0].cod_cebe);
                               
                            } else {

                                $("#txtDocContabCuen").val('').prop('disabled', true);
                                $('#cboDebeHaber').html('').prop('disabled', true);
                                $("#txtDocContabImport").val('').prop('disabled', true);
                                $("#cboIndiImpuest").html('').prop('disabled', true);
                                $("#txtCentCosto").val('').prop('disabled', true);
                            }

                            
                            //if ($("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Admin) {
                            //    $("#cboEstadosReg").prop('disabled', false);
                            //} else {
                            //    $("#cboEstadosReg").prop('disabled', true);
                            //    $("#cboTipDocReg").prop('disabled', true);
                            //    $("#cboMonDocReg").prop('disabled', true);
                            //}

                            var iconElementActualizar = $('<i>').addClass('ri-pencil-line');
                            $("#btn-Grabar").text(" ");
                            $('#btn-Grabar').append(iconElementActualizar);
                            $("#btn-Grabar").append("Actualizar");

                            //if ($("#txtNroDocMIRO").val() !== "" && $("#txtNroDocFI").val() !== "" )
                            //{
                            //    $("#btn-Gen-Reg-SAP").prop('disabled', true);
                            //}

                            if ($("#txtNroDocMIRO").val() == "" && $("#txtNroDocFI").val() == "" && resultadoFlagSAP) {
                                $("#btn-Gen-Reg-SAP").prop('disabled', false);
                            } else {
                                $("#btn-Gen-Reg-SAP").prop('disabled', true);
                            }

                            $("#chkConSAP").prop('disabled', false);
                            $("#chkApliDetra").prop('disabled', false);
                            $("#chkApliFondoGarant").prop('disabled', false);
                            $("#chkAgregCuenMayo").prop('disabled', false);
                            $("#txtNroDocMIRO").prop('disabled', false);
                            $("#txtNroDocFI").prop('disabled', false);


                            $("#txtNroAudiObsUsu").val(resultado[0].usu_observa);
                            $("#txtNroAudiObsFec").val(resultado[0].fec_observa);

                            $("#txtNroAudiAnuUsu").val(resultado[0].usu_anula);
                            $("#txtNroAudiAnuFec").val(resultado[0].fec_anula);

                            $("#txtNroAudiAprUsu").val(resultado[0].usu_aprueba);
                            $("#txtNroAudiAprFec").val(resultado[0].fec_aprueba);
                                                                                    

                            if ($("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Proveedor) {
                                $(".ConfNoProvee").removeClass("col-sm-7");


                                if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Observado) {
                                    $("#cboEstadosReg").prop('disabled', false);
                                    $("#cboEstadosReg").empty().append('<option value="OBS">Observado</option>');
                                    $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');
                                    $("#btn-Grabar").css('display', '');
                                    $("#CabConformidad").css('display', '');
                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Anulado ) {
                                    $("#btn-Grabar").css('display', 'none');
                                    
                                    $("#chkConSAP").prop('disabled', true);
                                    $("#chkApliDetra").prop('disabled', true);
                                    $("#chkApliFondoGarant").prop('disabled', true);
                                    $("#chkAgregCuenMayo").prop('disabled', true);
                                    $("#txtNroDocMIRO").prop('disabled', true);
                                    $("#txtNroDocFI").prop('disabled', true);

                                    $("#btn-Gen-Reg-SAP").prop('disabled', true);
                                    $("#CabConformidad").css('display', '');
                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Recepcionado) {
                                    $("#btn-Grabar").css('display', 'none');
                                    $("#CabConformidad").css('display', 'none');

                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.RecibidoConforme) {
                                    $("#btn-Grabar").css('display', 'none');
                                    $("#CabConformidad").css('display', 'none');
                                }

                            } else {

                                
                                if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Observado) {
                                    $("#DocContabl").css('display', 'none');

                                    $("#cboEstadosReg").prop('disabled', false);
                                    $("#cboMotObsReg").prop('disabled', false);
                                    $("#ConformidadComentarioTxtArea").prop('disabled', false);
                                    $("#cboEstadosReg").empty().append('<option value="OBS">Observado</option>');
                                    $("#cboEstadosReg").append('<option value="APR">Recibido Conforme</option>');
                                    $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');
                                    $("#btn-Grabar").css('display', '');
                                    $("#CabConformidad").css('display', '');
                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Anulado) {
                                    $("#chkConSAP").prop('disabled', true);
                                    $("#chkApliDetra").prop('disabled', true);
                                    $("#chkApliFondoGarant").prop('disabled', true);
                                    $("#chkAgregCuenMayo").prop('disabled', true);
                                    $("#txtNroDocMIRO").prop('disabled', true);
                                    $("#txtNroDocFI").prop('disabled', true);
                                    $("#cboEstadosReg").empty().append('<option value="ANU">Anulado</option>');
                                    $("#btn-Grabar").css('display', 'none');
                                    $("#btn-Gen-Reg-SAP").prop('disabled', true);
                                    $("#CabConformidad").css('display', '');
                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.Recepcionado) {
                                    $("#cboEstadosReg").prop('disabled', false);
                                    $("#cboEstadosReg").empty().append('<option value="REG">Recepcionado</option>');
                                    $("#cboEstadosReg").append('<option value="OBS">Observado</option>');
                                    $("#cboEstadosReg").append('<option value="APR">Recibido Conforme</option>');
                                    $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');
                                    $("#btn-Grabar").css('display', '');
                                    $("#DocContabl").css('display', 'none');
                                    $("#CabConformidad").css('display', 'none');

                                    $("#cboEstadosReg").change(function () {
                                        var selectedValue = $(this).val(); // Obtiene el valor seleccionado

                                        // Verifica si el valor es "valor1" o "valor2"
                                        if (selectedValue === Uti.Variable.EstadoStatus.Anulado || selectedValue === Uti.Variable.EstadoStatus.Observado) {
                                            $("#CabConformidad").css('display', ''); // Muestra el elemento
                                        } else {
                                            $("#CabConformidad").css('display', 'none'); // Oculta el elemento en otros casos
                                        }
                                    });



                                } else if (resultado[0].est_doc == Uti.Variable.EstadoStatus.RecibidoConforme) {
                                    $("#cboEstadosReg").prop('disabled', false);
                                    $("#cboEstadosReg").empty().append('<option value="APR">Recibido Conforme</option>');
                                    $("#cboEstadosReg").append('<option value="OBS">Observado</option>');
                                    $("#cboEstadosReg").append('<option value="REG">Recepcionado</option>');
                                    $("#cboEstadosReg").append('<option value="ANU">Anulado</option>');
                                    $("#DocContabl").css('display', '');
                                    $("#btn-Grabar").css('display', '');
                                    $("#CabConformidad").css('display', 'none');
                                }

                                if ($("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Logística) {
                                    $("#cboEstadosReg").prop('disabled', true);
                                }

                            }
                                                        
                            if ($("#FromEyeIdDocument").val() == "") {
                                $("#btnsDownloadXmlCdrPdf").css('display', 'none')
                            } else {
                                $("#btnsDownloadXmlCdrPdf").css('display', '')
                            }


                            $("#btn-Grabar").prop('disabled', false);

                            $("#txt_seguimiento").val(resultado[0].comen_segui);
                            /*$("#btn-Gen-Reg-SAP").prop('disabled', !resultadoFlagSAP);*/
                            
                        };

                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });
            },

            fnGetPDF: async function (nro_ord_oc, nro_adj, path, g_h, ruc) {// Cuando solo tiene  nro_ord_oc es porque busca la OC
                try {
                    Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);

                    const response = await fetch(Uti.Url.Base + '/RRHH/Documento/GetPdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: $.param({
                            nro_ord_oc: nro_ord_oc + ".pdf",
                            nro_adj: nro_adj,
                            path: path,
                            g_h: g_h,
                            ruc: ruc
                        })
                    });

                    
                    const contentType = response.headers.get("Content-Type") || "";

                    if (contentType.includes("application/json")) {
                        const json = await response.json();
                        if (json.Session === false) {
                            Uti.Modal.Message(json.Title, json.Description, json.Type, json.Function);
                            return;
                        }
                    }

                    
                    if (response.ok && contentType.includes("application/pdf")) {
                        const resultado = await response.blob();

                        if (resultado && resultado.size > 0) {
                            
                            Documento._Modal.fnPDFPreviewOpen();

                            
                            const url = URL.createObjectURL(resultado);
                            const iframe = `<iframe src="${url}#toolbar=0" width="800" height="600"></iframe>`;
                            $('#pdf-viewer').html(iframe);

                            
                            const downloadLink = $('#download-preview-pdf');
                            downloadLink.attr('href', url);

                            let nombre = "";
                            if (g_h === "G") {
                                nombre = "GUIA_" + nro_adj + ".pdf";
                            } else if (g_h === "H") {
                                nombre = "HES_" + nro_adj + ".pdf";
                            } else {
                                nombre = "OC_" + nro_ord_oc + ".pdf";
                            }

                            downloadLink.attr('download', nombre);

                        } else {
                            
                            if (!nro_adj || nro_adj.trim() === "") {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch,"No se encontró la OC: " + nro_ord_oc + ".pdf",Uti.Message.Type.Alerta);
                            } else if (g_h === "G") {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch,"Nro de Guía: " + nro_adj + " no encontrada.",Uti.Message.Type.Alerta);
                            } else if (g_h === "H") {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch,"Nro de HES: " + nro_adj + " no encontrada.",Uti.Message.Type.Alerta);
                            } else {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch,"Documento no encontrado o vacío.",Uti.Message.Type.Alerta);
                            }
                        }
                    } else {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation,"El servidor devolvió un formato no esperado.",Uti.Message.Type.Alerta);
                    }


                } catch (err) {
                    console.error("Error en fnGetPDF:", err);
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                } finally {
                    Uti.Modal.Process();
                }
            },

            fnGetSUSElectronico: function () {

                const id_sociedad = $("#cboSociedadReg").val();
                const anio = $("#txtFecRegReg").val().split("/")[2];
                const mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                const fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');


                let razonSocial = $("#FromSearchCabRazonSocial").val();
                // Eliminar el punto al final si existe
                razonSocial = razonSocial.endsWith('.') ? razonSocial.slice(0, -1) : razonSocial;

                const ruc = $("#FromSearchCabIdProvee").val() + '-' + razonSocial;
                const ruta_doc = $("#txtNroDocReg").val();


                const path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;
                const nameFile = $("#txtPDFSUSReg").val();

                if (nameFile == "") {
                    Uti.Modal.Message(Uti.Message.Title.AssistantSearch, "No hay archivo de sustento.", Uti.Message.Type.Alerta);
                } else {
                    $.ajax({
                        url: Uti.Url.Base + '/RRHH/Documento/GetSUSElectronico',
                        type: 'GET',
                        async: true,
                        cache: false,
                        data: {
                            path: encodeURIComponent(path),
                            nameFile: encodeURIComponent(nameFile),
                            ruc: $("#FromSearchCabIdProvee").val()
                        },
                        beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                        success: function (data, status, xhr) {
                            if (xhr.status === 204) {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch, xhr.statusText, Uti.Message.Type.Alerta);
                            } else {
                                window.location.href = `${Uti.Url.Base}/RRHH/Documento/GetSUSElectronico?path=${encodeURIComponent(path)}&nameFile=${encodeURIComponent(nameFile)}&ruc=${encodeURIComponent($("#FromSearchCabIdProvee").val())}`;
                                
                            }
                        }, error: function (xhr, status, error) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, error, Uti.Message.Type.Error);
                        }, complete: function (complete) { Uti.Modal.Process(); }
                    });
                }
                

            },


            fnGetXmlElectronico: function () {

                const id_sociedad = $("#cboSociedadReg").val();
                const anio = $("#txtFecRegReg").val().split("/")[2];
                const mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                const fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');
                

                let razonSocial = $("#FromSearchCabRazonSocial").val();
                // Eliminar el punto al final si existe
                razonSocial = razonSocial.endsWith('.') ? razonSocial.slice(0, -1) : razonSocial;

                const ruc = $("#FromSearchCabIdProvee").val() + '-' + razonSocial;
                const ruta_doc = $("#txtNroDocReg").val();


                const path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;
                const nameFile = $("#txtXMLReg").val();

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetXmlElectronico',
                    type: 'GET',
                    async: true,
                    cache: false,
                    data: {
                        path: encodeURIComponent(path),
                        nameFile: encodeURIComponent(nameFile),
                        ruc: encodeURIComponent($("#FromSearchCabIdProvee").val()),
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data, status, xhr) {
                        if (xhr.status === 204) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, xhr.statusText, Uti.Message.Type.Alerta);
                        } else {
                            window.location.href = `${Uti.Url.Base}/RRHH/Documento/GetXmlElectronico?path=${encodeURIComponent(path)}&nameFile=${encodeURIComponent(nameFile)}&ruc=${encodeURIComponent($("#FromSearchCabIdProvee").val())}`;
                        }
                    }, error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantSearch, error, Uti.Message.Type.Error);
                    },complete: function (complete) { Uti.Modal.Process(); }
                });

            },

            fnGetCDRElectronico: function () {

                const id_sociedad = $("#cboSociedadReg").val();
                const anio = $("#txtFecRegReg").val().split("/")[2];
                const mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                const fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');


                let razonSocial = $("#FromSearchCabRazonSocial").val();
                // Eliminar el punto al final si existe
                razonSocial = razonSocial.endsWith('.') ? razonSocial.slice(0, -1) : razonSocial;

                const ruc = $("#FromSearchCabIdProvee").val() + '-' + razonSocial;
                const ruta_doc = $("#txtNroDocReg").val();


                const path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;
                const nameFile = $("#txtCDRReg").val();

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetCDRElectronico',
                    type: 'GET',
                    async: true,
                    cache: false,
                    data: {
                        path: encodeURIComponent(path),
                        nameFile: encodeURIComponent(nameFile),
                        ruc: encodeURIComponent($("#FromSearchCabIdProvee").val()),
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data, status, xhr) {
                        if (xhr.status === 204) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, xhr.statusText, Uti.Message.Type.Alerta);
                        } else {
                            window.location.href = `${Uti.Url.Base}/RRHH/Documento/GetCDRElectronico?path=${encodeURIComponent(path)}&nameFile=${encodeURIComponent(nameFile)}&ruc=${encodeURIComponent($("#FromSearchCabIdProvee").val())}`;
                        }
                    }, error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantSearch, error, Uti.Message.Type.Error);
                    },complete: function (complete) { Uti.Modal.Process(); }
                });

            },

            fnGetPDFElectronico: function () {

                const id_sociedad = $("#cboSociedadReg").val();
                const anio = $("#txtFecRegReg").val().split("/")[2];
                const mes = parseInt($("#txtFecRegReg").val().split("/")[1], 10) + ". " + Documento._Other.fnGetMonthText($("#txtFecRegReg").val().split("/")[1]);
                const fech_arch = $("#txtFecRegReg").val().replace(/\//g, '.');


                let razonSocial = $("#FromSearchCabRazonSocial").val();
                // Eliminar el punto al final si existe
                razonSocial = razonSocial.endsWith('.') ? razonSocial.slice(0, -1) : razonSocial;

                const ruc = $("#FromSearchCabIdProvee").val() + '-' + razonSocial;
                const ruta_doc = $("#txtNroDocReg").val();


                const path = id_sociedad + "/" + anio + "/" + mes + "/" + fech_arch + "/" + ruc + "/" + ruta_doc;
                const nameFile = $("#txtPDFReg").val();

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetPDFElectronico',
                    type: 'GET',
                    async: true,
                    cache: false,
                    data: {
                        path: encodeURIComponent(path),
                        nameFile: encodeURIComponent(nameFile),
                        ruc: encodeURIComponent($("#FromSearchCabIdProvee").val())
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data, status, xhr) {
                        if (xhr.status === 204) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, xhr.statusText, Uti.Message.Type.Alerta);
                        } else {
                            window.location.href = `${Uti.Url.Base}/RRHH/Documento/GetPDFElectronico?path=${encodeURIComponent(path)}&nameFile=${encodeURIComponent(nameFile)}&ruc=${encodeURIComponent($("#FromSearchCabIdProvee").val())}`;
                        }
                    }, error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantSearch, error, Uti.Message.Type.Error);
                    },complete: function (complete) { Uti.Modal.Process(); }
                });

            },


            fnGetTrackingDocProvee: function (cod_proveedor, id_documento) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetTrackingDocProvee',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cod_proveedor: cod_proveedor,
                        id_documento: id_documento
                    },

                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {

                            let body = '';

                            Fase11Registrado = resultado[0].fecRegistro;
                            Fase12Observado = resultado[0].fecObserva;
                            Fase13Anulado = resultado[0].fecAnula;
                            Fase14RecibidoConforme = resultado[0].fecAprueba;
                            Fase21FechaSAP = resultado[0].fecAprueba;
                            Fase22NumeroSAP = resultado[0].docFISAP;
                            Fase31Fecha = resultado[0].fecVenPago;

                            
                            let parts = Fase31Fecha.split("/");
                            let fechaOriginal = new Date(parts[2], parts[1] - 1, parts[0]); 

                            let fechaSumada = new Date(fechaOriginal);
                            fechaSumada.setDate(fechaSumada.getDate() + 7);

                            const diaSumada = String(fechaSumada.getDate()).padStart(2, '0');
                            const mesSumada = String(fechaSumada.getMonth() + 1).padStart(2, '0'); 
                            const anioSumada = fechaSumada.getFullYear();

                            Fase31FechaSumada = `${diaSumada}/${mesSumada}/${anioSumada}`;


                            
                            let fechaHoy = new Date();

                            // Destroy existing Slick instance if it exists
                            if ($('.slider').hasClass('slick-initialized')) {
                                $('.slider').slick('unslick');
                            }


                            $('.slider').html('');

                            for (var i = 0; i < resultado.length; i++) {
                                Fase41Fecha = resultado[i].fecPago;
                                Fase42Banco = resultado[i].nomBanco;
                                Fase43Cuenta = resultado[i].desCuenta;
                                Fase44Moneda = resultado[i].monImporte;
                                Fase45Importe = resultado[i].numImporte;

                                Fase4NumeroPagos = resultado.length.toString();

                                body = '<div>'
                                         +'<div class="msjTranckingFase4">'
                                            + '<span id="LabelX" class="label"><i class="ri-check-line"></i>'+ " Fecha de Pago:" + '</span>'
                                            + '<span id="RespLabelX" class="respLabel" >' + Fase41Fecha+'</span>'
                                         +'</div>'
                                   

                                    
                                         +'<div class="msjTranckingFase4">'
                                            + '<span id="LabelX" class="label"><i class="ri-bank-line"></i>' + " Banco:" + '</span>'
                                            + '<span id="RespLabelX" class="respLabel">' + Fase42Banco + '</span>'
                                         +'</div>'
                                   

                                 
                                         +'<div class="msjTranckingFase4">'
                                            + '<span id="LabelX" class="label"><i class="ri-bank-card-line"></i>' + " Número de Cuenta:" + '</span>'
                                            + '<span id="RespLabelX" class="respLabel">' + Fase43Cuenta + '</span>'
                                         +'</div>'


                                        + '<div class="msjTranckingFase4">'

                                        if (Fase44Moneda !== "") {
                                            if (Fase44Moneda.toUpperCase() == "PEN") {
                                                body += '<span id="LabelX" class="label"><i class="solPeruano"></i>' + " Moneda:" + '</span>'
                                            }
                                            else if (Fase44Moneda.toUpperCase() == "USD") {
                                                body += '<span id="LabelX" class="label"><i class="ri-money-dollar-circle-line"></i>' + " Moneda:" + '</span>'
                                            }
                                            else {
                                                body += '<span id="LabelX" class="label"><i class="ri-money-euro-circle-line"></i>' + " Moneda:" + '</span>'
                                            }
                                               
                                        } else {
                                            body += '<span id="LabelX" class="label"><i class="ri-check-line"></i>' + " Moneda:" + '</span>'
                                        }
                                                                               
                                        body += '<span id="RespLabelX" class="respLabel">' + Fase44Moneda + '</span>'

                                           +'</div>'
                                  

                               
                                    + '<div class="msjTranckingFase4">'
                                            + '<span id="LabelX" class="label"><i class="ri-wallet-3-line"></i>' + " Importe:" + '</span>'
                                            + '<span id="RespLabelX" class="respLabel">' + Fase45Importe + '</span>'
                                         +'</div>'

                                      +'</div>'

                                   
                                $('.slider').append(body);

                            }
                            

                            // Destroy existing Slick instance if it exists
                            if ($('.slider').hasClass('slick-initialized')) {
                                $('.slider').slick('unslick');
                                $('.slider').html('');
                            }


                            $('.slider').slick({
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                autoplay: true,
                                autoplaySpeed: 750,
                                dots: true,
                                arrows: false,
                                initialSlide : 0
                            });

                            if (resultado.length == 1 ) {
                                setTimeout(function () {
                                    $(".slick-track").css("width", "");
                                    $(".slick-slide.slick-current.slick-active").css("width", "580px");
                                }, 100); // 2000 milisegundos = 2 segundos
                            } else {

                                // Selecciona el div con la clase específica y comprueba su atributo data-slick-index
                                $('.slick-slide.slick-cloned').each(function () {
                                    var slickIndex = $(this).data('slick-index');
                                    if (slickIndex <= 1) {
                                        // Realiza alguna acción si el valor de data-slick-index es menor a 0
                                        
                                        
                                        $(this).css('width', '580px');
                                        /*$(".slick-slide.slick-cloned").css("width", "535px");*/
                                    }
                                });

                                setTimeout(function () {
                                    $(".slick-track").css("width", "");
                                    $(".slick-slide.slick-current.slick-active").css("width", "580px");

                                }, 100); // 2000 milisegundos = 2 segundos
                            }
                           

                            if ($("#layout-wrapper").hasClass("dark-mode")) {
                                $(".slick-slide").css("background", "#05427a");
                                $(".slick-slide.slick-current.slick-active").css("background", "#05427a");
                            } else {
                                $(".slick-slide").css("background", "#E6F7FF");
                                $(".slick-slide.slick-current.slick-active").css("background", "#E6F7FF");
                            }
                            


                            Documento._Modal.fnTrackingOpen();


                            if (Fase41Fecha !== "" && Fase31Fecha !== "" && Fase21FechaSAP !== "" && Fase13Anulado == "") {
                                $(".slider").css('display', '');
                                $(".rectangleTrancking2").css("height", "315px");

                                $(".msjTrancking").css('margin-bottom','0');

                                

                                $("#Fase4").addClass("completed");
                                $("#Fase3").addClass("completed");
                                $("#Fase2").addClass("completed");



                                $("#Label1").css("display", "none");
                                $("#RespLabel1").css("display", "none");

                                $("#Label2").css("display", "none");
                                $("#RespLabel2").css("display", "none");

                                $("#Label3").css("display", "none");
                                $("#RespLabel3").css("display", "none");

                                $("#Label4").css("display", "none");
                                $("#RespLabel4").css("display", "none");

                                $("#Label5").css("display", "none");
                                $("#RespLabel5").css("display", "none");


                                $("#TxtTrackingPrincipal").text("Tu Documento se encuentra en la Fase 4");
                                $("#TxtTrackingFase4NumPagos").text("Número de pagos: " + Fase4NumeroPagos);
                                $("#TxtTrackingFase4NumPagos").css("display", "");
                                currentIndex = 3;
                                maxIndex = 3;
                                

                            //} else if (Fase31Fecha !== "" && Fase21FechaSAP !== "" && Fase13Anulado == "" ) {
                            } else if (fechaHoy >= fechaSumada && Fase21FechaSAP !== "" && Fase13Anulado == "" ) {
                                $(".slider").css('display', 'none');
                                $(".rectangleTrancking2").css("height", "65px");

                                $("#Fase4").removeClass("completed");
                                $("#Fase3").addClass("completed");
                                $("#Fase2").addClass("completed");

                                var iconElement = $('<i>').addClass('ri-send-plane-2-line');
                                $("#Label1").text(" ");
                                $('#Label1').append(iconElement);
                                $("#Label1").append(" Fecha estimada de pago:");
                                $("#Label1").css("display", "block");
                                $("#RespLabel1").css("display", "");
                                
                                //$("#RespLabel1").text(Fase31Fecha);
                                $("#RespLabel1").text(Fase31FechaSumada);

                                $("#Label2").css("display", "none");
                                $("#RespLabel2").css("display", "none");

                                $("#Label3").css("display", "none");
                                $("#RespLabel3").css("display", "none");

                                $("#Label4").css("display", "none");
                                $("#RespLabel4").css("display", "none");

                                $("#Label5").css("display", "none");
                                $("#RespLabel5").css("display", "none");

                                $("#TxtTrackingPrincipal").text("Tu Documento se encuentra en la Fase 3");
                                $("#TxtTrackingFase4NumPagos").css("display", "none");
                                currentIndex = 2;
                                maxIndex = 2;

                            } else if (Fase21FechaSAP !== "" && Fase13Anulado == "") {
                                $(".slider").css('display', 'none');
                                $(".rectangleTrancking2").css("height", "120px");
                                

                                $("#Fase4").removeClass("completed");
                                $("#Fase3").removeClass("completed");
                                $("#Fase2").addClass("completed");

                                var iconElement = $('<i>').addClass('ri-check-line');
                                $("#Label1").text(" ");
                                $('#Label1').append(iconElement);
                                $("#Label1").append(" Fecha:");
                                $("#Label1").css("display", "block");
                                $("#RespLabel1").css("display", "");
                                $("#RespLabel1").text(Fase21FechaSAP);

                                var iconElement2 = $('<i>').addClass('ri-hashtag');
                                $("#Label2").text(" ");
                                $('#Label2').append(iconElement2);
                                $("#Label2").append(" Número de Registro:");
                                $("#Label2").css("display", "block");
                                $("#RespLabel2").css("display", "");
                                $("#RespLabel2").text(Fase22NumeroSAP);

                                $("#Label3").css("display", "none");
                                $("#RespLabel3").css("display", "none");

                                $("#Label4").css("display", "none");
                                $("#RespLabel4").css("display", "none");

                                $("#Label5").css("display", "none");
                                $("#RespLabel5").css("display", "none");;

                                $("#TxtTrackingPrincipal").text("Tu Documento se encuentra en la Fase 2");
                                $("#TxtTrackingFase4NumPagos").css("display", "none");
                                currentIndex = 1;
                                maxIndex = 1;
                                
                            } else {
                                $(".slider").css('display', 'none');
                                $(".rectangleTrancking2").css("height", "230px");
                                

                                $("#Fase4").removeClass("completed");
                                $("#Fase3").removeClass("completed");
                                $("#Fase2").removeClass("completed");

                                var iconElement = $('<i>').addClass('ri-send-plane-2-line');
                                $("#Label1").text(" ");
                                $('#Label1').append(iconElement);
                                $("#Label1").append(" Recepcionado:");
                                $("#Label1").css("display", "block");
                                $("#RespLabel1").css("display", "");
                                $("#RespLabel1").text(Fase11Registrado);


                                var iconElement2 = $('<i>').addClass('ri-eye-line');
                                $("#Label2").text(" ");
                                $('#Label2').append(iconElement2);
                                $("#Label2").append(" Observado:");
                                $("#Label2").css("display", "block");
                                $("#RespLabel2").css("display", "");
                                $("#RespLabel2").text(Fase12Observado);

                                var iconElement3 = $('<i>').addClass('ri-close-line');
                                $("#Label3").text(" ");
                                $('#Label3').append(iconElement3);
                                $("#Label3").append(" Anulado:");
                                $("#Label3").css("display", "block");
                                $("#RespLabel3").css("display", "");
                                $("#RespLabel3").text(Fase13Anulado);

                                var iconElement4 = $('<i>').addClass('ri-check-line');
                                $("#Label4").text(" ");
                                $('#Label4').append(iconElement4);
                                $("#Label4").append(" Recibido Conforme:");
                                $("#Label4").css("display", "block");
                                $("#RespLabel4").css("display", "");
                                $("#RespLabel4").text(Fase14RecibidoConforme);

                                $("#Label5").css("display", "none");
                                $("#RespLabel5").css("display", "none");

                                $("#TxtTrackingPrincipal").text("Tu Documento se encuentra en la Fase 1");
                                $("#TxtTrackingFase4NumPagos").css("display", "none");
                                currentIndex = 0;
                                maxIndex = 0;
                                
                            }


                            $('#ModalTracking').one('shown.bs.modal', function () {
                                Documento._Modal.fnMoveCircle(currentIndex);
                            });

                            
                            
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });

            },

            fnGetPdfAsociadosHES: function (nro_hes) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetPdfAsociadosHES',
                    type: 'POST',
                    xhrFields: {
                        responseType: 'blob'
                    },
                    async: true,
                    cache: false,
                    data: {
                        nro_hes: nro_hes
                    },

                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else if (resultado.size > 0) {

                            Documento._Modal.fnPDFPreviewOpen();

                            const url = URL.createObjectURL(resultado);
                            const iframe = `<iframe src="${url}#toolbar=0" width="800" height="600"></iframe>`;
                            $('#pdf-viewer').html(iframe);

                            // Configurar el enlace de descarga
                            const downloadLink = $('#download-preview-pdf');
                            downloadLink.attr('href', url);
                            downloadLink.attr('download', nro_hes + ".pdf");


                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, nro_hes + ".pdf no encontrada.", Uti.Message.Type.Alerta);
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });

            },

            fnGetPdfAsociadosGUIAS: function (nro_entrega) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetPdfAsociadosGUIAS',
                    type: 'POST',
                    xhrFields: {
                        responseType: 'blob'
                    },
                    async: true,
                    cache: false,
                    data: {
                        nro_entrega: nro_entrega,
                        nro_sociedad: $("#cboSociedadReg").val()
                    },

                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else if (resultado.size > 0) {

                            Documento._Modal.fnPDFPreviewOpen();

                            const url = URL.createObjectURL(resultado);
                            const iframe = `<iframe src="${url}#toolbar=0" width="800" height="600"></iframe>`;
                            $('#pdf-viewer').html(iframe);

                            // Configurar el enlace de descarga
                            const downloadLink = $('#download-preview-pdf');
                            downloadLink.attr('href', url);
                            downloadLink.attr('download', nro_entrega + ".pdf");


                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantSearch, nro_entrega + ".pdf no encontrada.", Uti.Message.Type.Alerta);
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });

            },

            fnVerifyOC: function (nro_ord_oc) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetPdf',
                    type: 'POST',
                    xhrFields: {
                        responseType: 'blob'
                    },
                    async: true,
                    cache: false,
                    data: {
                        nro_ord_oc: nro_ord_oc + ".pdf",
                        nro_adj: "",
                        path: "",
                        g_h: ""
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else if (resultado.size > 0) {

                            $("#txtVerifyOC").val(nro_ord_oc);

                        } else {
                            $("#txtVerifyOC").val("");

                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },
                    complete: function (complete) { Uti.Modal.Process(); }
                });

            }


        },

        _FromDashBoard: function () {


            //Viene del Dashboard de la OC Pendientes por Registrar
            if ($('#FromDashOC').val() != '') {

                $("#ArquiPDFAntiguo").css('display', 'none');
                //$("#btn-Volver").css("display", "none");
                var icon = '<i class="ri-arrow-go-back-fill me-2 align-bottom"></i>';
                $("#btn-Volver").text("");
                $("#btn-Volver").append(icon);
                $("#btn-Volver").append(" Volver a Pendientes");


                /*Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Alerta: OC " + $('#FromDashProv').val(), Uti.Message.Type.Error);*/
                $('.card-body ul li a[href="#tab-search"]').prop('disabled', true);
                $('.card-body ul li a[href="#tab-search"]').removeAttr('data-bs-toggle');

                $('a[href="#tab-search"]').closest('li').remove();

                /*$('.card-body ul li a[href="#tab-search"]').remove('data-bs-toggle', 'tab');*/
                $('.card-body ul li a[href="#tab-register"]').tab('show');
                $('#txtNroOrdenReg').val($('#FromDashOC').val());

                $("#downloadPDFSUS").css('display', 'none');

                if ($("#FromUserProfileTypeReg").val() !== Uti.Variable.ProfileType.Admin) {
                    $("#cboEstadosReg").prop('disabled', true);
                    $("#cboTipDocReg").prop('disabled', true);
                    $("#cboMonDocReg").prop('disabled', true);

                    $(".ConfNoProvee").removeClass("col-sm-7");
                }


                Documento._Search.fnVerifyOC($("#txtNroOrdenReg").val());

                //Llenar con SAP 1. Orden De Compra
                var ajax1 = $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/GetOrdenesCompraSAP',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        id_proveedor: $('#FromDashProv').val(),
                        id_OrdCompra: $('#FromDashOC').val()
                    },

                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {
                            $('#cboSociedadReg').val(resultado.E_SOCIEDAD);
                            /*sociedadAjax1 = resultado.E_SOCIEDAD;*/
                            sociedadAjax1 = $("#cboSociedadReg").val();
                            $('#cboSociedadReg').prop('disabled', true);

                            $('#cboClassOrdenReg').val(resultado.E_CLASE_DOC);
                            $('#cboClassOrdenReg').prop('disabled', true);

                            $('#txtNroOrdenCompra').val(Documento._Other.convertDateFormat(resultado.E_FECHA));
                            $('#txtNroOrdenCompra').prop('disabled', true);

                            $('#txtMonedaReg').val(resultado.E_MONEDA);
                            $('#txtMonedaReg').prop('disabled', true);

                            $('#txtSubTotReg').val(resultado.E_TOTAL);
                            $('#txtSubTotReg').prop('disabled', true);

                            if ($("#FromDashGuiaOrHes").val() == 'G') { //Para las GUIAS
                                $("#GuiaorHesReg").text('Guía')


                                var ajax2 = $.ajax({
                                    url: Uti.Url.Base + '/RRHH/Documento/GetGuiasDeOrdCompraSAP',
                                    type: 'POST',
                                    async: true,
                                    cache: false,
                                    data: {
                                        id_OrdCompra: $('#FromDashOC').val(),
                                        sociedad: sociedadAjax1
                                    },
                                    //beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); }, LAST
                                    success: function (resultado) {

                                        if (resultado.Session == false) {
                                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                                            Uti.Modal.Process();
                                        }
                                        else if (resultado == null) {
                                            Uti.Modal.Process();
                                        } else {
                                            var sumaWRBTR = 0
                                            $('#details-list-documento-reg').html('')
                                            if (resultado.length > 0) {

                                                let cadena = $('#FromDashNroEntregas').val();
                                                let Entregas = cadena.split(',');
                                                NumRegDinamicPenSAP = resultado.length + 1;

                                                // Crear una lista de promesas para ejecutar las validaciones PDF de forma asíncrona
                                                let promises = [];

                                                for (let i = 0; i < resultado.length; i++) {

                                                    const Unique = resultado[i].BELNR;
                                                    //const property = 'FechExam="' + resultado[i].DatosExmFechExm + '" NombCompl="' + resultado[i].NombCompleto + '"NumDoc="' + resultado[i].NumDoc + '" CodAten="' + resultado[i].CodAten + '" UniAten="' + resultado[i].UniAten;
                                                    //const Unique = resultado[i].NumDoc + resultado[i].CodAten + resultado[i].UniAten;
                                                    const prop = " IdfileInput=" + i + " " + " namePDF=" + resultado[i].BELNR + " ";

                                                    let trashIconHtmlBuscar = $('#trashIconTemplate_Buscar').html()
                                                        .replace('UNIQUE_ID_BUSCAR', Unique)
                                                        .replace('IdfileInputUNIQUE', i)

                                                    $("#AnularDet").css("display", "");
                                                    if (Entregas.includes(resultado[i].BELNR)) {

                                                        let body = '<tr class ="AsociIngresxSAP">'
                                                            + '<td class="text-center">' + resultado[i].BELNR + '</td>'  //SAP
                                                            + '<td class="text-center">' + Documento._Other.convertDateFormat(resultado[i].BLDAT) + '</td>'  //Fecha De Documento
                                                            + '<td class="text-center">' + Documento._Other.convertDateFormat(resultado[i].BUDAT) + '</td>' //Fecha De Contabilizacion
                                                            + '<td class="text-center">' + resultado[i].WAERS + '</td>' //Moneda
                                                            + '<td class="text-center wrbtr-value">' + resultado[i].WRBTR + '</td>' //Importe Total
                                                            + '<td class="text-center">' + resultado[i].XBLNR + '</td>'

                                                            /*+ '<td class="text-center"><a href="javascript:void(0);" id=slnkNroUnique' + resultado[i].BELNR + ' name=slnkNroUnique' + resultado[i].BELNR + prop + ' " class="link-info" style="font-size: 30px"><i class="ri-close-line" style="color:red;"></i></a></td>'*/
                                                            + '<td class="text-center ">' + trashIconHtmlBuscar + '</td>'

                                                            + '<td class="text-center"><a href="javascript:void(0);" class="link-info" style="font-size: 30px;"><i id=slnkAdjDet' + i + prop + ' name=slnkAdjDet' + i + ' class="custom-ri-pdf-2-line-black" style="cursor:pointer;"></i></a></td>'
                                                            + '<td >'
                                                            + '<input type="file" style="display:none;" id=fileInput' + i + prop + 'accept="application/pdf">'
                                                            + '<div class="">'
                                                            + '<input type = "text" class="form-control txtDetOrdComPDF" id=txtDetOrdComPDF' + i + prop + 'name="txtDetOrdComPDF" disabled>'
                                                            + '</div>'
                                                            + '</td>'
                                                            + '</tr>'

                                                        $('#details-list-documento-reg').append(body);

                                                        var sumaWRBTR = sumaWRBTR + resultado[i].WRBTR;

                                                        $('#details-list-documento-reg #slnkTrashBuscar' + Unique).on('click', function () {
                                                            const IdfileInput = $(this).attr('IdfileInput');
                                                            var fila = $(this).closest('tr');
                                                            var wrbtrValue = parseFloat(fila.find('.wrbtr-value').text());
                                                            sumaWRBTR = sumaWRBTR - wrbtrValue;
                                                            fila.remove();
                                                            $('#txtValTotIngReg').val(sumaWRBTR.toFixed(2));
                                                            delete filesIngresAsoci[IdfileInput];
                                                            NumRegDinamicPenSAP = NumRegDinamicPenSAP - 1;
                                                        });


                                                        $("#slnkAdjDet" + i).on('click', function () {
                                                            Documento._Search.fnGetPdfAsociadosGUIAS(resultado[i].BELNR);
                                                        });


                                                        if (resultado[i].isTherePDF == "S") {
                                                            // Obtener el nombre del archivo del input
                                                            const fileName = resultado[i].BELNR + ".pdf";
                                                            $('#txtDetOrdComPDF' + i).val(fileName);

                                                            // Cambiar la clase del enlace para indicar que hay un archivo PDF
                                                            $("#slnkAdjDet" + i).removeClass('custom-ri-pdf-2-line-black');
                                                            $("#slnkAdjDet" + i).addClass('custom-ri-pdf-2-line-red');
                                                        } else {
                                                            // Si no hay archivo PDF, limpiar el valor y eliminar el archivo del array
                                                            $('#txtDetOrdComPDF' + i).val('');
                                                            delete filesIngresAsoci[i];

                                                            // Cambiar la clase del enlace para indicar que no hay archivo PDF
                                                            $("#slnkAdjDet" + i).removeClass('custom-ri-pdf-2-line-red');
                                                            $("#slnkAdjDet" + i).addClass('custom-ri-pdf-2-line-black');
                                                        }

                                                    }

                                                }//termina el for

                                                //Espera a que todas las promesas se resuelvan
                                                Promise.all(promises)
                                                    .then(function () {
                                                        // Todo el trabajo ha terminado, desbloquea la pantalla
                                                        $('#txtValTotIngReg').val(sumaWRBTR.toFixed(2));

                                                        // Esperar a que ajax1 y ajax2 terminen para ejecutar ajax3
                                                        $.when(ajax1, ajax2)
                                                            .done(function () {
                                                                Documento._Validation.fnGetOCPendRegistered();
                                                                /*location.reload();*/

                                                                // Recargar solo la primera vez
                                                                if (!localStorage.getItem('pageReloaded')) {
                                                                    localStorage.setItem('pageReloaded', 'true'); // Marcar que ya se recargó
                                                                    location.reload(); // Recargar la página
                                                                }


                                                            })

                                                        //Uti.Modal.Process(); LAST
                                                    }).catch(function (error) {
                                                        console.error("Error en una de las promesas: ", error);
                                                        Uti.Modal.Process(); // Asegura que la pantalla se desbloquee incluso si hay un error
                                                    });

                                            } else {
                                                //Uti.Modal.Process(); LAST
                                            }
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                                        Uti.Modal.Process();
                                    }

                                });





                            } else { //Para las HES
                                $("#GuiaorHesReg").text('HES')


                                var ajax2 = $.ajax({
                                    url: Uti.Url.Base + '/RRHH/Documento/GetHESDeOrdCompraSAP',
                                    type: 'POST',
                                    async: true,
                                    cache: false,
                                    data: {
                                        id_OrdCompra: $('#FromDashOC').val(),
                                        nro_hes: $("#FromDashNroHES").val(),
                                        sociedad: sociedadAjax1

                                    },
                                    //beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); }, LAST
                                    success: function (resultado) {

                                        if (resultado.Session == false) {
                                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                                            Uti.Modal.Process();
                                        }
                                        else if (resultado == null) {
                                            Uti.Modal.Process();
                                        } else {
                                            var sumaWRBTR = 0
                                            $('#details-list-documento-reg').html('')
                                            if (resultado.length > 0) {

                                                let cadena = $('#FromDashNroEntregas').val();
                                                let Entregas = cadena.split(',');
                                                NumRegDinamicPenSAP = resultado.length + 1;

                                                // Crear una lista de promesas para ejecutar las validaciones PDF de forma asíncrona
                                                let promises = [];

                                                for (let i = 0; i < resultado.length; i++) {
                                                    //const Unique = resultado[i].BELNR;
                                                    const Unique = resultado[i].XBLNR;


                                                    //const property = 'FechExam="' + resultado[i].DatosExmFechExm + '" NombCompl="' + resultado[i].NombCompleto + '"NumDoc="' + resultado[i].NumDoc + '" CodAten="' + resultado[i].CodAten + '" UniAten="' + resultado[i].UniAten;
                                                    //const Unique = resultado[i].NumDoc + resultado[i].CodAten + resultado[i].UniAten;
                                                    const prop = " IdfileInput=" + i + " " + " namePDF=" + resultado[i].XBLNR + " ";

                                                    let trashIconHtmlBuscar = $('#trashIconTemplate_Buscar').html()
                                                        .replace('UNIQUE_ID_BUSCAR', Unique)
                                                        .replace('IdfileInputUNIQUE', i)

                                                    $("#AnularDet").css("display", "");

                                                    if (Entregas.includes(resultado[i].BELNR)) {

                                                        let body = '<tr class ="AsociIngresxSAP">'
                                                            + '<td class="text-center">' + resultado[i].BELNR + '</td>' //SAP
                                                            + '<td class="text-center">' + Documento._Other.convertDateFormat(resultado[i].BLDAT) + '</td>' //Fecha De Documento
                                                            + '<td class="text-center">' + Documento._Other.convertDateFormat(resultado[i].BUDAT) + '</td>' //Fecha De Contabilizacion
                                                            + '<td class="text-center">' + resultado[i].WAERS + '</td>' //Moneda
                                                            + '<td class="text-center wrbtr-value">' + resultado[i].WRBTR + '</td>' //Importe Total
                                                            + '<td class="text-center">' + resultado[i].XBLNR + '</td>' //HES


                                                            /*+ '<td class="text-center"><a href="javascript:void(0);" id=slnkNroUnique' + resultado[i].BELNR + ' name=slnkNroUnique' + resultado[i].BELNR + prop + ' " class="link-info" style="font-size: 30px"><i class="ri-close-line" style="color:red;"></i></a></td>'*/
                                                            + '<td class="text-center">' + trashIconHtmlBuscar + '</td>'


                                                            + '<td class="text-center"><a href="javascript:void(0);" class="link-info" style="font-size: 30px;"><i id=slnkAdjDet' + i + prop + ' name=slnkAdjDet' + i + ' class="custom-ri-pdf-2-line-black" style="cursor:pointer;"></i></a></td>'
                                                            + '<td >'
                                                            + '<input type="file" style="display:none;" id=fileInput' + i + prop + 'accept="application/pdf">'
                                                            + '<div class="">'
                                                            + '<input type = "text" class="form-control txtDetOrdComPDF" id=txtDetOrdComPDF' + i + prop + 'name="txtDetOrdComPDF" disabled>'
                                                            + '</div>'
                                                            + '</td>'
                                                            + '</tr>'

                                                        $('#details-list-documento-reg').append(body);

                                                        var sumaWRBTR = sumaWRBTR + resultado[i].WRBTR;

                                                        $('#details-list-documento-reg #slnkTrashBuscar' + Unique).on('click', function () {
                                                            const IdfileInput = $(this).attr('IdfileInput');
                                                            var fila = $(this).closest('tr');
                                                            var wrbtrValue = parseFloat(fila.find('.wrbtr-value').text());
                                                            sumaWRBTR = sumaWRBTR - wrbtrValue;
                                                            fila.remove();
                                                            $('#txtValTotIngReg').val(sumaWRBTR.toFixed(2));
                                                            delete filesIngresAsoci[IdfileInput];
                                                            NumRegDinamicPenSAP = NumRegDinamicPenSAP - 1;
                                                        });



                                                        $("#slnkAdjDet" + i).on('click', function () {
                                                            //const IdfileInput = $(this).attr('IdfileInput');
                                                            //$("#fileInput" + IdfileInput).click();
                                                            Documento._Search.fnGetPdfAsociadosHES(resultado[i].XBLNR);

                                                        });


                                                        if (resultado[i].isTherePDF == "S") {
                                                            // Obtener el nombre del archivo del input
                                                            const fileName = resultado[i].XBLNR + ".pdf"
                                                            $('#txtDetOrdComPDF' + i).val(fileName);


                                                            //// Convertir el array de bytes (fileByte) a un Blob
                                                            //const byteArray = new Uint8Array(resultado[i].fileByte);
                                                            //const fileBlob = new Blob([byteArray], { type: 'application/pdf' });

                                                            //// Crear un objeto File a partir del Blob con el nombre adecuado
                                                            //const namedFile = new File([fileBlob], fileName, { type: 'application/pdf' });

                                                            //// Asignar el archivo al array de archivos
                                                            //filesIngresAsoci[i] = namedFile;

                                                            $("#slnkAdjDet" + i).removeClass('custom-ri-pdf-2-line-black');
                                                            $("#slnkAdjDet" + i).addClass('custom-ri-pdf-2-line-red');
                                                        } else {
                                                            $('#txtDetOrdComPDF' + i).val('');
                                                            delete filesIngresAsoci[i];

                                                            $("#slnkAdjDet" + i).removeClass('custom-ri-pdf-2-line-red');
                                                            $("#slnkAdjDet" + i).addClass('custom-ri-pdf-2-line-black');
                                                        }


                                                    }



                                                }// termina el for

                                                // Espera a que todas las promesas se resuelvan
                                                Promise.all(promises)
                                                    .then(function () {
                                                        // Todo el trabajo ha terminado, desbloquea la pantalla
                                                        $('#txtValTotIngReg').val(sumaWRBTR.toFixed(2));

                                                        // Esperar a que ajax1 y ajax2 terminen para ejecutar ajax3
                                                        $.when(ajax1, ajax2)
                                                            .done(function () {
                                                                Documento._Validation.fnGetOCPendRegistered();

                                                                // Recargar solo la primera vez
                                                                if (!localStorage.getItem('pageReloaded')) {
                                                                    localStorage.setItem('pageReloaded', 'true'); // Marcar que ya se recargó
                                                                    location.reload(); // Recargar la página
                                                                }

                                                            })
                                                        //.always(function () {
                                                        //    Uti.Modal.Process();
                                                        //});

                                                        //Uti.Modal.Process(); LAST
                                                    }).catch(function (error) {
                                                        console.error("Error en una de las promesas: ", error);
                                                        //Uti.Modal.Process(); // Asegura que la pantalla se desbloquee incluso si hay un error LAST
                                                    });



                                            } else {
                                                Uti.Modal.Process();
                                            }

                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                                        Uti.Modal.Process();
                                    }
                                });



                            }


                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    }
                    //,                    complete: function (complete) { Uti.Modal.Process(); }
                });


                //Llenar con SAP 2. Ingresos Asociados






            }

        },
        _FrmDocumentoBuscar: function () {

            if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Proveedor) {
                $("#txtProveedor").prop('disabled', true);
                $("#btn-buscar-Proveedor").prop('disabled', true);

                $('#hdcod_Proveedor').val($("#FromDashProv").val());
                /*$('#txtProveedor').val(rowData.attr('nom_prov'));*/
            }



            //Rango de Fechas del filtro
            //minDate: new Date(2020, 12, 02),//new Date(2020, 12, 02),//new Date().fp_incr(-60), //el new Date(y,m,d) el mes que coloque en realidad es un mes mas para la web
            //maxDate: new Date(2025, 12, 02),//new Date(2021, 12, 30),//"30/01/2022",//"today",
            //defaultDate: ["24/01/2024", "25/01/2024"]

            //flatpickr('#FechaRangoDoc', {
            //    mode: "range",
            //    minDate: new Date(1995, 12, 01),//new Date(2020, 12, 02),//new Date().fp_incr(-60), //el new Date(y,m,d) el mes que coloque en realidad es un mes mas para la web
            //    maxDate: "today",
            //    dateFormat: "d/m/Y",
            //    defaultDate: [new Date().fp_incr(-60), "today"],
            //    allowInput: true
            //});


            flatpickr('#FechaDesdeReg', {
                dateFormat: "d/m/Y",
                allowInput: true,
                minDate: "01/01/1990",
                maxDate: "today",
                defaultDate: "today",
                disableMobile: "false"
            });

            flatpickr('#FechaHastaReg', {
                dateFormat: "d/m/Y",
                allowInput: true,
                minDate: "01/01/1990",
                maxDate: "today",
                defaultDate: "today",
                disableMobile: "false"

            });



            if ($("#FromDashUserProfileType").val() !== Uti.Variable.ProfileType.Admin) {
                $('#chkDatosContabCab').css('display', 'none');
            }


            $("#txtNroOrdenCompraBus").on('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');
            });


            $('#sbtnBuscar').on('click', function () {
                if ($("#FechaDesdeReg").val().length == 0 || $("#FechaHastaReg").val().length == 0) {
                    Uti.Modal.Toastify('Debe colocar el rango de fechas.', Uti.Message.Type.Aviso);
                } else {
                    Documento._Search.fnDocumentoSearch(0);
                }

            });


            $("#chkConSAP").on("change", function () {
                const isChecked = $("#chkConSAP").is(":checked");
                const nroDocFI = $('#txtNroDocFI').val().trim();
                const nroDocMIRO = $('#txtNroDocMIRO').val().trim();
                const sinErrores = !$("#error-message").is(":visible");

                const camposVacios = nroDocFI === '' && nroDocMIRO === '';

                if (isChecked && camposVacios && sinErrores) {
                    $('#btn-Gen-Reg-SAP').prop('disabled', false);
                } else {
                    $('#btn-Gen-Reg-SAP').prop('disabled', true);
                }
            });

            



            $('#btn-buscar-Proveedor').on('click', function () {
                Documento._Search.fnGetProveedor();
            });



            $('#sbtnExcel').click(function () {
                var data = [];

                if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Admin) {


                    $('#details-list-proveedor tr').each(function () {
                        var row = {};
                        row.FecRegistro = $(this).find('td').eq(0).text() || '';
                        row.FecDoc = $(this).find('td').eq(1).text() || '';
                        row.CodProveedor = $(this).find('td').eq(2).text() || '';
                        row.RazonSocial = $(this).find('td').eq(3).text() || '';
                        row.IdSociedad = $(this).find('td').eq(4).text() || '';
                        row.TipoDoc = $(this).find('td').eq(5).text() || '';
                        row.NroDoc = $(this).find('td').eq(6).text() || '';
                        row.MonDoc = $(this).find('td').eq(7).text() || '';
                        row.MontoDoc = $(this).find('td').eq(8).text() || '';
                        row.TipoDocOc = $(this).find('td').eq(9).text() || '';
                        row.NroDocOc = $(this).find('td').eq(10).text() || '';
                        row.NroGuia = $(this).find('td').eq(11).text() || '';
                        row.EstDoc = $(this).find('td').eq(12).text() || '';
                        row.DocMiroSap = $(this).find('td').eq(13).text() || '';
                        row.DocFiSap = $(this).find('td').eq(14).text() || '';
                        row.EstObs = $(this).find('td').eq(15).text() || '';
                        row.ComenDoc = $(this).find('td').eq(16).text() || '';
                        row.ComenSegui = $(this).find('td').eq(17).text() || '';
                        data.push(row);
                    });

                } else {


                    $('#details-list-proveedor tr').each(function () {
                        var row = {};
                        row.FecRegistro = $(this).find('td').eq(0).text() || '';
                        row.FecDoc = $(this).find('td').eq(1).text() || '';
                        //row.CodProveedor = $(this).find('td').eq(2).text() || '';
                        //row.RazonSocial = $(this).find('td').eq(3).text() || '';
                        //row.IdSociedad = $(this).find('td').eq(4).text() || '';
                        //row.TipoDoc = $(this).find('td').eq(5).text() || '';
                        row.NroDoc = $(this).find('td').eq(2).text() || '';
                        row.MonDoc = $(this).find('td').eq(3).text() || '';
                        row.MontoDoc = $(this).find('td').eq(4).text() || '';
                        row.TipoDocOc = $(this).find('td').eq(5).text() || '';
                        row.NroDocOc = $(this).find('td').eq(6).text() || '';
                        row.NroGuia = $(this).find('td').eq(7).text() || '';
                        row.EstDoc = $(this).find('td').eq(8).text() || '';
                        /*row.DocMiroSap = $(this).find('td').eq(12).text() || '';*/
                        row.DocFiSap = $(this).find('td').eq(9).text() || '';
                        row.EstObs = $(this).find('td').eq(10).text() || '';
                        row.ComenDoc = $(this).find('td').eq(11).text() || '';
                        data.push(row);
                    });

                }


                var JSONData = JSON.stringify(data);
                // Si no hay registros en la grilla
                if (data.length === 0) {
                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.RequiredDetalleLinea, Uti.Message.Type.Alerta);
                    return;
                }


                $.ajax({
                    url: '/RRHH/Documento/ExportToExcel',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSONData,
                    beforeSend: function () {
                        $("#sbtnExcel").prop('disabled', true);
                    },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, "Su Sessión ha expirado", resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado.message == 'NULL') {
                            Uti.Modal.Toastify(Uti.Message.Description.NotFoundInformation, Uti.Message.Type.Alerta);
                        }
                        else {
                            Uti.Download.Bytes(resultado.fileByte, 'Documentos.xlsx');
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.responseText.includes("La solicitud JSON era demasiado grande como para deserializarse")) {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.RequiredMoreTimeout, Uti.Message.Type.Alerta);
                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        }
                    },
                    complete: function () {
                        $("#sbtnExcel").prop('disabled', false);
                    }
                });
            });


            $('#sbtnLimpiar').on('click', function () {
                Documento._Clear.fnClearFilter();
            });



            // Detectar entrada al modal de registro para la auditoria quien mira(atiende) a la factura
            $('#li-tab-register a').on('shown.bs.tab', function () {

                if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Admin) {
                    currentDocumentId = $("#FromEyeIdDocument").val(); // Obtener ID del documento desde un input oculto o similar
                    if (currentDocumentId) {
                        // Registrar que el documento está en uso
                        $.ajax({
                            url: Uti.Url.Base + '/RRHH/Documento/UpdAuditDocSet',
                            type: 'POST',
                            data: { id_documento: currentDocumentId },
                            success: function (response) {
                                if (!response.success) {
                                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, response.message, Uti.Message.Type.Alerta);
                                    currentDocumentId = null;
                                    // Cambiar a la pestaña de búsqueda
                                    $('#li-tab-search a').tab('show');
                                }
                            },
                            error: function () {
                                Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Error al verificar el estado del documento.', Uti.Message.Type.Error);
                            }
                        });
                    }
                }




            });


            // Detectar salida del modal o cambio de tab para la auditoria quien mira(atiende) a la factura
            $('#li-tab-search a').on('shown.bs.tab', function () {
                if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Admin) {
                    Documento._Clear.fnUpdAuditDocUnSet();
                }
            });

            // Detectar salida del modal o cambio de tab para la auditoria quien mira(atiende) a la factura
            window.onbeforeunload = function () {
                if ($("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Admin) {
                    Documento._Clear.fnUpdAuditDocUnSet();
                }
            };


        },
        _FrmDocumentoRegistrar: function () {

            function fncleanXMLString(xmlStr) {
                // Elimina caracteres de control inválidos excepto \t (9), \n (10) y \r (13)
                // elimina caracteres de control inválidos (ASCII 0-8, 11-12, 14-31, 127)
                return xmlStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
            }

            $('#txtNroDocFI, #txtNroDocMIRO').on('input', function () {
                // Comprobar si ambos campos están vacíos
                const nroDocFI = $('#txtNroDocFI').val().trim();
                const nroDocMIRO = $('#txtNroDocMIRO').val().trim();
                const chkConSAPChecked = $('#chkConSAP').is(':checked');

                if (nroDocFI === '' && nroDocMIRO === '' && !$("#error-message").is(":visible") && chkConSAPChecked  ) {
                    // Habilitar el botón si ambos campos están vacíos y esta con check
                    $('#btn-Gen-Reg-SAP').prop('disabled', false);
                } else {
                    // Deshabilitar el botón si alguno de los campos tiene contenido
                    $('#btn-Gen-Reg-SAP').prop('disabled', true);
                }

            });




            $('#openPdfButton').on('click', function () {
                Documento._Search.fnGetPDF($("#txtNroOrdenReg").val(), "", "", "", "");
            });




            $('#btn-Subir-XML').on('click', function () {
                console.log("FUNCIONO");
            
                const file = $('#fileInputXML').get(0).files[0];
                if (!file) {
                    Uti.Modal.Toastify('Seleccione un archivo XML', Uti.Message.Type.Aviso);
                    return;
                }

                const rawXml = $('#XML_Hidden').val();
                const cleanXml = fncleanXMLString(rawXml);

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(cleanXml, "text/xml");

                const cboTipDocReg = $(xmlDoc).find("cbc\\:InvoiceTypeCode").text();

                let txtNroDocReg = "";

                let textXmlFechEmision = "";

                if (cboTipDocReg) {
                    const txtSubTotReg3 = $(xmlDoc)
                        .find("cac\\:LegalMonetaryTotal > cbc\\:LineExtensionAmount")
                        .first()
                        .text();
                    
                    txtSubTotReg3Let = txtSubTotReg3;

                    const cboMonDocReg = $(xmlDoc).find("cbc\\:DocumentCurrencyCode").text();
                    cboMonDocRegLet = cboMonDocReg;

                    txtNroDocReg = $(xmlDoc)
                        .find("cbc\\:ID")
                        .filter(function () {
                            return $(this).parent().is("Invoice"); // Filtra para que solo queden los que tienen <Invoice> como padre
                        })
                        .first()
                        .text();
                    txtNroDocRegLet = txtNroDocReg;

                } else {
                    const txtSubTotReg3 = $(xmlDoc)
                        .find("n1\\:LegalMonetaryTotal > n2\\:LineExtensionAmount")
                        .first()
                        .text();
                    txtSubTotReg3Let = txtSubTotReg3;

                    const cboMonDocReg = $(xmlDoc).find("n2\\:DocumentCurrencyCode").text();
                    cboMonDocRegLet = cboMonDocReg;


                    txtNroDocReg = $(xmlDoc)
                        .find("n2\\:ID")
                        .filter(function () {
                            return $(this).parent().is("Invoice"); // Filtra para que solo queden los que tienen <Invoice> como padre
                        })
                        .first()
                        .text();
                    txtNroDocRegLet = txtNroDocReg;
                }


                (async function () {



                    const cboTipDocRegv1 = $(xmlDoc).find("cbc\\:InvoiceTypeCode").text();
                    const cboTipDocRegv2 = $(xmlDoc).find("n2\\:InvoiceTypeCode").text();
                    let txtRUC = "";

                    let txtRucSociedad = "";

                    if (cboTipDocRegv1.length > 0) {
                        txtRUC = $(xmlDoc)
                            .find("cbc\\:ID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:PartyIdentification") && $(this).parents("cac\\:AccountingSupplierParty").length > 0
                            })
                            .first()
                            .text();

                        txtRucSociedad = $(xmlDoc)
                            .find("cbc\\:ID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:PartyIdentification") && $(this).parents("cac\\:AccountingCustomerParty").length > 0
                            })
                            .first()
                            .text();

                    }
                    else {
                        txtRUC = $(xmlDoc)
                            .find("n2\\:ID")
                            .filter(function () {
                                return $(this).parent().is("n1\\:PartyIdentification") && $(this).parents("cac\\:AccountingSupplierParty").length > 0
                            })
                            .first()
                            .text();

                        txtRucSociedad = $(xmlDoc)
                            .find("n2\\:ID")
                            .filter(function () {
                                return $(this).parent().is("n1\\:PartyIdentification") && $(this).parents("n1\\:AccountingCustomerParty").length > 0
                            })
                            .first()
                            .text();

                    }

                    const difMoneda = await Documento._Validation.fnGetValidarMontoFactura(); //Moneda y monto
                    const validaFactura = await Documento._Validation.fnGetValidarFactura(); //Factura repetida
                    let perteneceProveedor = "";

                    if (txtRUC !== $("#FromDashProvReg").val() ) {
                        perteneceProveedor = `La factura ${txtNroDocReg} le corresponde a otra Compañía.`;
                    }

                    let perteneceSociedad = "";

                    let txtRucSociedadOC = ""
                    let txtNomRucSociedadOC = ""

                    let txtNomRucSociedad = "";
                    if (txtRucSociedad == "20525019200") {
                        txtNomRucSociedad = "Southern Peaks Mining Peru S.A.C."
                    } else if (txtRucSociedad == "20100056802") {
                        txtNomRucSociedad = "Compañía Minera Condestable S.A.";
                    } else if (txtRucSociedad == "20543905306") {
                        txtNomRucSociedad = "Ariana Operaciones Mineras S.A.C.";
                    }

                    if ($("#cboSociedadReg").val() =="1000") {
                        txtRucSociedadOC = "20525019200";
                        txtNomRucSociedadOC = "Southern Peaks Mining Peru S.A.C."
                    } else if ($("#cboSociedadReg").val() == "2000"){
                        txtRucSociedadOC = "20100056802";
                        txtNomRucSociedadOC = "Compañía Minera Condestable S.A.";
                    } else if ($("#cboSociedadReg").val() == "3000") {
                        txtRucSociedadOC = "20543905306";
                        txtNomRucSociedadOC = "Ariana Operaciones Mineras S.A.C.";
                    }

                    if (txtRucSociedad !== txtRucSociedadOC) {
                        
                        perteneceSociedad = `El RUC de la factura está emitido a ${txtNomRucSociedad} mientras que el RUC de la Orden
                                            de Compra es de ${txtNomRucSociedadOC}, por favor verificar los documentos.`;
                    }

                    if (Documento._Validation.fnValidarSession(difMoneda) === false || Documento._Validation.fnValidarSession(validaFactura) === false) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Su Sessión ha expirado", Uti.Message.Type.Error);
                    } else {
                        if (difMoneda.trim() !== "" || validaFactura.trim() !== "" || perteneceProveedor.trim() !== "" || perteneceSociedad.trim() !== "") {

                            let body = `<ul style="text-align: justify;">`;

                            if (difMoneda.trim() !== "") {
                                const words = difMoneda.split(". ");
                                words
                                    .filter(x => x.trim() !== "")
                                    .forEach(x => body += `<li>${x.trim()}</li>`);
                            }



                            if (validaFactura.trim() !== "") {
                                body += `<li>${validaFactura}</li>`;
                            }

                            if (perteneceProveedor.trim() !== "") {
                                body += `<li>${perteneceProveedor}</li>`;
                            }

                            if (perteneceSociedad.trim() !== "") {
                                body += `<li>${perteneceSociedad}</li>`;
                            }

                            body += "</ul>";

                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, body, Uti.Message.Type.Error);

                            $("#cboEstadosReg").val("%");
                            $("#txtFecRegReg").val("");

                            $("#cboTipDocReg").val("%");
                            $("#txtNroDocReg").val("");
                            $("#txtFecEmiReg").val("");

                            $("#cboMonDocReg").val("%");
                            $("#txtSubTotReg3").val("");
                            $("#txtImpTotReg").val("");

                            /*$("#XML_Hidden").val("");*/

                            $("#txtXMLReg").val("");
                            $("#txtCDRReg").val("");
                            $("#txtPDFReg").val("");

                            $("#fileInputCDR").hide()
                            $("#btn-Subir-CDR").hide()

                            $("#fileInputPDF").hide()
                            $("#btn-Subir-PDF").hide()
                            
                            return;

                        } else {
                            //Subir


                            if (cboTipDocReg) {
                                $('#cboTipDocReg').val(cboTipDocReg);
                                $('#cboTipDocReg').prop('disabled', true);

                                const cboMonDocReg = $(xmlDoc).find("cbc\\:DocumentCurrencyCode").text();
                                $('#cboMonDocReg').val(cboMonDocReg);
                                $('#cboMonDocReg').prop('disabled', true);

                                const filePath = $('#fileInputXML').val();
                                const fileName = filePath.split('\\').pop();
                                $('#txtXMLReg').val(fileName);



                                //
                                $('#cboEstadosReg').val("REG");
                                $('#cboEstadosReg').prop('disabled', true);

                                const txtNroDocReg = $(xmlDoc)
                                    .find("cbc\\:ID")
                                    .filter(function () {
                                        return $(this).parent().is("Invoice"); // Filtra para que solo queden los que tienen <Invoice> como padre
                                    })
                                    .first()
                                    .text();
                                $('#txtNroDocReg').val(txtNroDocReg);
                                $("#XMLNroDoc").val(txtNroDocReg);

                                const txtSubTotReg3 = $(xmlDoc)
                                    .find("cac\\:LegalMonetaryTotal > cbc\\:LineExtensionAmount")
                                    .first()
                                    .text();
                                $('#txtSubTotReg3').val(parseFloat(txtSubTotReg3));


                                //
                                $('#txtFecRegReg').val($("#CurrentDate").val());

                                const txtFecEmiReg = $(xmlDoc)
                                    .find("cbc\\:IssueDate")
                                    .filter(function () {
                                        return $(this).parent().is("Invoice"); // Filtra para que solo queden los que tienen <Invoice> como padre
                                    })
                                    .first().text();
                                $('#txtFecEmiReg').val(Documento._Other.convertDateFormat(txtFecEmiReg));
                                $("#XMLFechaEmision").val(Documento._Other.convertDateFormat(txtFecEmiReg));

                                const txtImpTotReg = $(xmlDoc)
                                                    .find("cac\\:LegalMonetaryTotal > cbc\\:PayableAmount")
                                                    .first()
                                                    .text();

                                $('#txtImpTotReg').val(parseFloat(txtImpTotReg));

                            } else {


                                // XML versión 2
                                const cboTipDocReg2 = $(xmlDoc).find("n2\\:InvoiceTypeCode").text();
                                $('#cboTipDocReg').val(cboTipDocReg2).prop('disabled', true);

                                const cboMonDocReg = $(xmlDoc).find("n2\\:DocumentCurrencyCode").text();
                                $('#cboMonDocReg').val(cboMonDocReg).prop('disabled', true);

                                const filePath = $('#fileInputXML').val();
                                const fileName = filePath.split('\\').pop();
                                $('#txtXMLReg').val(fileName);


                                //

                                $('#cboEstadosReg').val("REG");
                                $('#cboEstadosReg').prop('disabled', true);

                                const txtNroDocReg = $(xmlDoc)
                                    .find("n2\\:ID")
                                    .filter(function () {
                                        return $(this).parent().is("Invoice"); // Filtra para que solo queden los que tienen <Invoice> como padre
                                    })
                                    .first()
                                    .text();

                                $('#txtNroDocReg').val(txtNroDocReg);
                                $("#XMLNroDoc").val(txtNroDocReg);


                                const txtSubTotReg3 = $(xmlDoc)
                                    .find("n1\\:LegalMonetaryTotal > n2\\:LineExtensionAmount")
                                    .first()
                                    .text();
                                $('#txtSubTotReg3').val(parseFloat(txtSubTotReg3));


                                //


                                $('#txtFecRegReg').val($("#CurrentDate").val());

                                const txtFecEmiReg = $(xmlDoc).find("n2\\:IssueDate").text();
                                $('#txtFecEmiReg').val(Documento._Other.convertDateFormat(txtFecEmiReg));
                                $("#XMLFechaEmision").val(Documento._Other.convertDateFormat(txtFecEmiReg));

                                const txtImpTotReg = $(xmlDoc)
                                    .find("n1\\:LegalMonetaryTotal > n2\\:PayableAmount")
                                    .text();
                                $('#txtImpTotReg').val(parseFloat(txtImpTotReg));


                            }



                            Documento._Operation.fnFileUploadXmlCdrPdfTemp($("#fileInputXML").get(0).files[0], "XML", "XML");

                            $("#fileInputCDR").show()
                            $("#btn-Subir-CDR").show()

                            //$("#fileInputPDF").show()
                            //$("#btn-Subir-PDF").show()

                            $("#fileInputPDFSUS").show()
                            $("#btn-Subir-PDF-SUS").show()

                            $("#btn-Subir-SUS-Cab").show();  // Esto respeta el estilo original como flex o block

                            $("#btn-Subir-CDR-Cab").css('display', '');
                            //$("#btn-Subir-PDF-Cab").css('display', '');
                        }
                    }

                })();




            });


            $('#btn-Subir-CDR').on('click', function () {
                const file = $('#fileInputCDR').get(0).files[0];
                if (!file) {
                    Uti.Modal.Toastify('Seleccione un archivo CDR', Uti.Message.Type.Aviso);
                    return;
                }
                

                if (file.name.toLowerCase().endsWith(".xml")) {


                    const rawCDR = $('#CDR_Hidden').val();
                    const cleanCDR = fncleanXMLString(rawCDR);

                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(cleanCDR, "text/xml");

                    // Leemos los Tags del XML por versiones de CDR
                    const xInvoice = $(xmlDoc).find("ar\\:ApplicationResponse").text();
                    const xInvoiceA = $(xmlDoc).find("ApplicationResponse").text();
                    const xInvoice4 = $(xmlDoc).find("ns4\\:ApplicationResponse").text();

                    let txtCODIGO = "";
                    let txtFactura = "";
                    let txtRUC_Emisor = "";
                    let txtRUC_Receptor = "";

                    let txtCdrFechaEmision = "";
                    let txtCdrNroDoc = "";

                    let errores = [];

                    let txtRucSociedadOC = "";
                    let txtNomRucSociedadOC = "";

                    if ($("#cboSociedadReg").val() == "1000") {
                        txtRucSociedadOC = "20525019200";
                        txtNomRucSociedadOC = "Southern Peaks Mining Peru S.A.C."
                    } else if ($("#cboSociedadReg").val() == "2000") {
                        txtRucSociedadOC = "20100056802";
                        txtNomRucSociedadOC = "Compañía Minera Condestable S.A.";
                    } else if ($("#cboSociedadReg").val() == "3000") {
                        txtRucSociedadOC = "20543905306";
                        txtNomRucSociedadOC = "Ariana Operaciones Mineras S.A.C.";
                    }

                    if (xInvoice.length > 0) {
                        txtCODIGO = $(xmlDoc)
                            .find("cbc\\:ResponseCode")
                            //.filter(function () {
                            //    return $(this).parent().is("ns3\\:DocumentReference") && $(this).parents("ns3\\:DocumentResponse").length > 0
                            //})
                            .first()
                            .text();

                        txtFactura = $(xmlDoc)
                            .find("cbc\\:ID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:DocumentReference")
                            })
                            .first()
                            .text();



                        //Fecha de emisión
                        txtCdrFechaEmision = $(xmlDoc)
                            .find("cbc\\:IssueDate")
                            .filter(function () {
                                return $(this).parent().is("cac\\:DocumentReference")
                            })
                            .first()
                            .text();


                        if (txtCdrFechaEmision.length == 0) {

                            txtCdrFechaEmision = $(xmlDoc)
                                .find("cbc\\:IssueDate")
                                .first()
                                .text();
                            
                        }

                        txtCdrFechaEmision = Documento._Other.convertDateFormat(txtCdrFechaEmision);


                        //Emisor y Receptor
                        if ( $(xmlDoc).find("cac\\:PartyLegalEntity").text().length > 0 ) {

                            txtRUC_Receptor = $(xmlDoc)
                                .find("cbc\\:CompanyID")
                                .filter(function () {
                                    return $(this).parent().is("cac\\:PartyLegalEntity") && $(this).parents().is("cac\\:RecipientParty")
                                })
                                .first()
                                .text();

                            txtRUC_Emisor = $(xmlDoc)
                                .find("cbc\\:CompanyID")
                                .filter(function () {
                                    return $(this).parent().is("cac\\:PartyLegalEntity") && $(this).parents().is("cac\\:IssuerParty")
                                })
                                .first()
                                .text();

                        } else if ($(xmlDoc).find("cac\\:PartyIdentification").text().length > 0) {

                            let textoRUC_Receptor = $(xmlDoc)
                                .find("cbc\\:ID")
                                .filter(function () {
                                    return $(this).parent().is("cac\\:PartyIdentification") && $(this).parents().is("cac\\:RecipientParty")
                                })
                                .first()
                                .text();

                            txtRUC_Receptor = textoRUC_Receptor.split("-")[1];

                            txtRUC_Emisor = $(xmlDoc)
                                .find("cbc\\:ID")
                                .filter(function () {
                                    return $(this).parent().is("cac\\:PartyIdentification") && $(this).parents().is("cac\\:ReceiverParty")
                                })
                                .first()
                                .text();

                        }


                    }

                    if (xInvoiceA.length > 0) {
                        txtCODIGO = $(xmlDoc)
                            .find("cbc\\:ResponseCode")
                            //.filter(function () {
                            //    return $(this).parent().is("ns3\\:DocumentReference") && $(this).parents("ns3\\:DocumentResponse")
                            //})
                            .first()
                            .text();

                        txtFactura = $(xmlDoc)
                            .find("cbc\\:ID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:DocumentReference")
                            })
                            .first()
                            .text();

                        txtRUC_Receptor = $(xmlDoc)
                            .find("cbc\\:CompanyID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:PartyLegalEntity") && $(this).parents().is("cac\\:RecipientParty")
                            })
                            .first()
                            .text();

                        txtRUC_Emisor = $(xmlDoc)
                            .find("cbc\\:CompanyID")
                            .filter(function () {
                                return $(this).parent().is("cac\\:PartyLegalEntity") && $(this).parents().is("cac\\:IssuerParty")
                            })
                            .first()
                            .text();


                        //Fecha de emisión
                        txtCdrFechaEmision = $(xmlDoc)
                            .find("cbc\\:IssueDate")
                            .filter(function () {
                                return $(this).parent().is("cac\\:DocumentReference")
                            })
                            .first()
                            .text();


                        if (txtCdrFechaEmision.length == 0) {

                            txtCdrFechaEmision = $(xmlDoc)
                                .find("cbc\\:IssueDate")
                                .first()
                                .text();

                        }

                        txtCdrFechaEmision = Documento._Other.convertDateFormat(txtCdrFechaEmision);

                    }

                    if (xInvoice4.length > 0) {
                        txtCODIGO = $(xmlDoc)
                            .find("ResponseCode")
                            //.filter(function () {
                            //    return $(this).parent().is("ns3\\:DocumentReference") && $(this).parents("ns3\\:DocumentResponse")
                            //})
                            .first()
                            .text();

                        txtFactura = $(xmlDoc)
                            .find("ID")
                            .filter(function () {
                                return $(this).parent().is("ns3\\:DocumentReference")
                            })
                            .first()
                            .text();

                        txtRUC_Receptor = $(xmlDoc)
                            .find("CompanyID")
                            .filter(function () {
                                return $(this).parent().is("ns3\\:PartyLegalEntity") && $(this).parents().is("ns3\\:RecipientParty")
                            })
                            .first()
                            .text();

                        txtRUC_Emisor = $(xmlDoc)
                            .find("CompanyID")
                            .filter(function () {
                                return $(this).parent().is("ns3\\:PartyLegalEntity") && $(this).parents().is("ns3\\:IssuerParty")
                            })
                            .first()
                            .text();


                        txtCdrFechaEmision = $(xmlDoc)
                            .find("IssueDate")
                            .first()
                            .text();
                        txtCdrFechaEmision = Documento._Other.convertDateFormat(txtCdrFechaEmision);


                    }

                    if (txtCODIGO.length === 0 || txtFactura.length === 0 || txtRUC_Receptor.length === 0 ) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "Cargar un CDR correcto.", Uti.Message.Type.Error);
                        return;
                    }

                    //Erorres
                    if (txtCODIGO != "0") {
                        errores.push("El CDR NO tiene estado de ACEPTADO, verificar en SUNAT.");
                    }
                    
                    if (txtFactura != $("#XMLNroDoc").val()) {
                        errores.push(`El nro. de documento del CDR (${txtFactura}) y del XML (${$("#XMLNroDoc").val()}) no coinciden.`);
                    }

                    if (txtRUC_Receptor != txtRucSociedadOC ) {
                        errores.push("El RUC receptor por el CDR no corresponde a " + txtNomRucSociedadOC);
                    }

                    if (txtRUC_Emisor != $("#FromDashProvReg").val() ) {
                        errores.push("El RUC emisor por el CDR no corresponde a " + $("#FromDashRucFullName").val() );
                    }
                    
                    if (txtCdrFechaEmision != $("#XMLFechaEmision").val()) {
                        errores.push(`La fecha de emisión del CDR (${txtCdrFechaEmision}) con el XML (${$("#XMLFechaEmision").val()}) no coinciden.`);
                    }

                    
                    if (errores.length > 0) {
                        const listaErrores = "<ul style='padding-left: 20px; margin: 0;'>" +
                                                errores.map(err => `<li>${err}</li>`).join('') +
                                             "</ul>";

                        $("#fileInputPDF").hide()
                        $("#btn-Subir-PDF").hide()
                        $("#btn-Subir-PDF-Cab").css('display', 'none');

                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, listaErrores, Uti.Message.Type.Error );
                        return;
                    }

                }

                $("#fileInputPDF").show();
                $("#btn-Subir-PDF").show();
                $("#btn-Subir-PDF-Cab").css('display', '');

                // Guardamos el nombre para mostrarlo al usuario
                $('#txtCDRReg').val(file.name.toLowerCase());

                Documento._Operation.fnFileUploadXmlCdrPdfTemp(file, "CDR", "CDR");
            });
            $('#btn-Subir-PDF').on('click', function () {
                const file = $('#fileInputPDF').get(0).files[0];
                if (!file) {
                    Uti.Modal.Toastify('Seleccione un archivo PDF', Uti.Message.Type.Aviso);
                    return;
                }
                // Guardamos el nombre para mostrarlo al usuario
                $('#txtPDFReg').val(file.name.toLowerCase());
                Documento._Operation.fnFileUploadXmlCdrPdfTemp(file, "FAC", "FAC");
            });
            $('#btn-Subir-PDF-SUS').on('click', function () {
                const file = $('#fileInputPDFSUS').get(0).files[0];
                if (!file) {
                    Uti.Modal.Toastify('Seleccione un archivo PDF', Uti.Message.Type.Aviso);
                    return;
                }
                // Guardamos el nombre para mostrarlo al usuario
                $('#txtPDFSUSReg').val(file.name.toLowerCase());
                Documento._Operation.fnFileUploadXmlCdrPdfTemp(file, "SUS", "Sustento");
            });


            $('#btn-buscar-Ingreso').on('change', function (event) {
                const file = event.target.files[0];
                const fileName = file.name.toLowerCase();
                if ($("#cboClassOrdenReg").val() == "ZNB" || $("#cboClassOrdenReg").val() == "ZSUB") {
                    if (file) {
                        if (file.type !== 'application/pdf' && !fileName.includes('.pdf')) {
                            Uti.Modal.Message('Asistente de archivo PDF', 'Solo se admite archivos con extensión: (.pdf)', 'Aviso');
                            $('#btn-buscar-Ingreso').val("");
                            return;
                        }

                    }
                }

            });
            $("#btn-cargar-Ingreso").on('click', function () {
                $("#txtIngReg").val($('#btn-buscar-Ingreso')[0].files[0].name);
                $("#btn-cargar-Ingreso").attr('disabled', true);
            });
            
            $("#btn-Subir-SUS-Cab").hide();
            $("#btn-Subir-CDR-Cab").css('display', 'none');
            $("#btn-Subir-PDF-Cab").css('display', 'none');





            //Botones de buscar archivos XML, CDR y PFDF
            $('#fileInputXML').on('change', function (event) {
                const file = event.target.files[0];
                if (!file) {
                    $("#cboEstadosReg").val("%");
                    $("#txtFecRegReg").val("");

                    $("#cboTipDocReg").val("%");
                    $("#txtNroDocReg").val("");
                    $("#txtFecEmiReg").val("");

                    $("#cboMonDocReg").val("%");
                    $("#txtSubTotReg3").val("");
                    $("#txtImpTotReg").val("");

                    $("#XML_Hidden").val("");

                    $("#txtXMLReg").val("");
                    $("#txtCDRReg").val("");
                    $("#txtPDFReg").val("");

                    $("#fileInputCDR").hide();
                    $("#btn-Subir-CDR").hide();

                    $("#fileInputPDF").hide();
                    $("#btn-Subir-PDF").hide();

                    $("#fileInputPDFSUS").hide();
                    $("#btn-Subir-PDF-SUS").hide();



                    return;
                } 
                    
                const fileName = file.name.toLowerCase();
                const validExtension = /\.(xml)$/i;

                if (file) {
                    if (!(file.type === 'application/xml' || file.type === 'text/xml' || file.type === 'application/xhtml+xml')) {
                        Uti.Modal.Message('Asistente de archivo de XML', 'Solo se admite archivos con extensión: .xml', 'Aviso');
                        $(this).val("");
                        return;
                    }

                    if (!validExtension.test(fileName)) {
                        Uti.Modal.Message('Asistente de archivo de XML', 'Solo se admiten archivos con extensión: .xml', 'Aviso');
                        $(this).val(""); // Limpia el input
                        return;
                    }
                }

                const fileSizeMB = file.size / (1024 * 1024);
                const maxSizeMB = parseFloat($("#MaxSize").val());


                if (fileSizeMB > maxSizeMB) {
                    Uti.Modal.Toastify('El archivo no debe exceder los ' + maxSizeMB + ' MB', Uti.Message.Type.Error);
                    $(this).val(""); // Limpia el input
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    const xmlText = e.target.result;
                    $('#XML_Hidden').val(xmlText);

                };
                reader.readAsText(file);
                
            });
            $('#fileInputCDR').on('change', function (event) {
                const file = event.target.files[0];
                if (!file) {
                    $("#txtCDRReg").val("");
                    $("#CDR_Hidden").val("");

                    $("#fileInputPDF").hide();
                    $("#btn-Subir-PDF").hide();
                    $("#btn-Subir-PDF-Cab").css('display', 'none');

                    $("#txtPDFReg").val("");

                    return;
                }
                const fileName = file.name.toLowerCase();

                if (!(file.type === 'application/xml' || file.type === 'text/xml' || file.type === 'application/xhtml+xml' || file.type === 'application/pdf' )) {
                    Uti.Modal.Message('Asistente de archivo de CDR', 'Solo se admiten archivos con extensión .xml o .pdf', 'Aviso');
                    $(this).val("");
                    return;
                }


                const validExtension = /\.(xml|pdf)$/i;

                if (!validExtension.test(fileName)) {
                    Uti.Modal.Message('Asistente de archivo de CDR', 'Solo se admiten archivos con extensión .xml o .pdf', 'Aviso');
                    $(this).val(""); // Limpia el input
                    return;
                }



                const fileSizeMB = file.size / (1024 * 1024);
                const maxSizeMB = parseFloat($("#MaxSize").val());

                if (fileSizeMB > maxSizeMB) {
                    Uti.Modal.Toastify('El archivo no debe exceder los ' + maxSizeMB + ' MB', Uti.Message.Type.Error);
                    $(this).val(""); // Limpia el input
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    const cdrText = e.target.result;
                    $('#CDR_Hidden').val(cdrText);

                };
                reader.readAsText(file);


                

                
            });
            $('#fileInputPDF').on('change', function (event) {
                const file = event.target.files[0];
                if (!file) {
                    $("#txtPDFReg").val("");
                    return;
                }
                
                const fileName = file.name.toLowerCase();

                if (!(file.type === 'application/pdf')) {
                    Uti.Modal.Message('Asistente de archivo PDF', 'Solo se admiten archivos con extensión: .pdf', 'Aviso');
                    $(this).val("");
                    return;
                }


                const validExtension = /\.(pdf)$/i;

                if (!validExtension.test(fileName) ) {
                    Uti.Modal.Message('Asistente de archivo PDF', 'Solo se admiten archivos con extensión: .pdf', 'Aviso');
                    $(this).val("");
                    return;
                }

                const fileSizeMB = file.size / (1024 * 1024);
                const maxSizeMB = parseFloat($("#MaxSize").val());

                if (fileSizeMB > maxSizeMB) {
                    Uti.Modal.Toastify('El archivo no debe exceder los ' + maxSizeMB + ' MB', Uti.Message.Type.Error);
                    $(this).val(""); // Limpia el input
                    return;
                }

                
            });
            $('#fileInputPDFSUS').on('change', function (event) {

                const file = event.target.files[0];
                if (!file) {
                    $("#txtPDFSUSReg").val("");
                    return;
                }
                const fileName = file.name.toLowerCase();

                if (!(file.type === 'application/pdf')) {
                    Uti.Modal.Message('Asistente de archivo PDF', 'Solo se admiten archivos con extensión: .pdf', 'Aviso');
                    $(this).val("");
                    return;
                }

                const validExtension = /\.(pdf)$/i;

                if (!validExtension.test(fileName)) {
                    Uti.Modal.Message('Asistente de archivo PDF', 'Solo se admiten archivos con extensión: .pdf', 'Aviso');
                    $(this).val("");
                    return;
                }

                const fileSizeMB = file.size / (1024 * 1024);
                const maxSizeMB = parseFloat($("#MaxSize").val());

                if (fileSizeMB > maxSizeMB) {
                    Uti.Modal.Toastify('El archivo no debe exceder los ' + maxSizeMB + ' MB', Uti.Message.Type.Error);
                    $(this).val(""); // Limpia el input
                    return;
                }

                
            });



            if ($("#FromEyeIdDocument").val() == "") {//Cuando solo entras para registar, nada por descargar
                $("#btnsDownloadXmlCdrPdf").css('display', 'none')
            } else {
                $("#btnsDownloadXmlCdrPdf").css('display', '')
            }


            $("#downloadPDFSUS").on('click', function () {
                Documento._Search.fnGetSUSElectronico();
            });

            $("#downloadXML").on('click', function () {
                Documento._Search.fnGetXmlElectronico();
            });

            $("#downloadCDR").on('click', function () {
                Documento._Search.fnGetCDRElectronico();
            });

            $("#downloadPDF").on('click', function () {
                Documento._Search.fnGetPDFElectronico();
            });



            $("#chkApliDetra").on('change', function () {

                if ($(this).is(':checked')) {
                    $('#cboTipoDetracc').html(optionsDetra).prop('disabled', false);
                } else {
                    $('#cboTipoDetracc').html('').prop('disabled', true);
                }

            });

            $("#chkApliFondoGarant").on('change', function () {


                if ($(this).is(':checked')) {
                    $('#cboTipoFondoGaranti').html(optionsGarant).prop('disabled', false);
                } else {
                    $('#cboTipoFondoGaranti').html('').prop('disabled', true);
                }

            });

            $("#chkAgregCuenMayo").on('change', function () {




                if ($(this).is(':checked')) {
                    $("#txtDocContabCuen").prop('disabled', false);
                    $('#cboDebeHaber').html(optionsDH).prop('disabled', false);
                    $("#txtDocContabImport").prop('disabled', false);
                    $("#cboIndiImpuest").html(optionsIndImp).prop('disabled', false);
                    $("#txtCentCosto").prop('disabled', false);

                } else {
                    $("#txtDocContabCuen").val('').prop('disabled', true);
                    $('#cboDebeHaber').html('').prop('disabled', true);
                    $("#txtDocContabImport").val('').prop('disabled', true);
                    $("#cboIndiImpuest").html('').prop('disabled', true);
                    $("#txtCentCosto").val('').prop('disabled', true);
                    $("#error-message").hide();
                }

                if ($('#txtNroDocMIRO').val().trim() == "" && $('#txtNroDocFI').val().trim() == "" && !$("#error-message").is(":visible")) {
                    $('#btn-Gen-Reg-SAP').prop('disabled', false);
                } else {
                    $('#btn-Gen-Reg-SAP').prop('disabled', true);
                }

            });



            if ($("#FromDashOC").val() !== "") {
                $("#CabConformidad").remove();
                $("#DocContabl").remove();
            }



            $("#cboEstadosReg").on('click', function () { //casi como $("#cboEstadosReg").on('change'

                if ($("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Admin) {

                    if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.Observado || $("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.Anulado) {
                        $("#CabConformidad").css('display', '');
                        $("#cboMotObsReg").prop('disabled', false);
                        $("#ConformidadComentarioTxtArea").prop('disabled', false);
                    } else {
                        $("#CabConformidad").css('display', 'none');
                        $("#cboMotObsReg").prop('disabled', true);
                        $("#ConformidadComentarioTxtArea").prop('disabled', true);
                    }

                }

                if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.RecibidoConforme && $("#FromUserProfileTypeReg").val() == Uti.Variable.ProfileType.Admin) {
                    $("#cboMotObsReg").val("");
                    $("#ConformidadComentarioTxtArea").val("");
                } else {
                    $("#cboMotObsReg").val($("#FromEyesMotObs").val());
                    $("#ConformidadComentarioTxtArea").val($("#FromEyesComent").val());
                }

            });

            $("#cboMotObsReg").on('change', function () {
                if ($("#cboMotObsReg").val() == "") {
                    $("#ConformidadComentarioTxtArea").val("");
                }
            });

    

            $("#btn-Gen-Reg-SAP").on('click', function () {
                

                Documento._Validation.fnGetValidarEstadoOC()
                    .then((res) => {
                        
                    })
                    .finally(() => {
                        Uti.Modal.Process();
                    });
                
            });



            $("#txtNroDocMIRO, #txtNroDocFI, #txtDocContabCuen, #txtCentCosto ").on("input", function () {
                // Reemplaza cualquier carácter que no sea un número
                this.value = this.value.replace(/[^0-9]/g, '');
            });



            $("#txtDocContabImport").on("input", function () {

                var cursorPosition = this.selectionStart;
                var value = this.value.replace(/[^0-9.]/g, '');
                var parts = this.value.split('.');
                if (parts.length > 2) {
                    // Si hay más de un punto, elimina todos los adicionales
                    this.value = parts[0] + '.' + parts.slice(1).join('');
                    $("#error-message").show();
                    $("#btn-Gen-Reg-SAP").prop('disabled', true); // Deshabilita el botón
                } else {
                    $("#error-message").hide();
                    $("#btn-Gen-Reg-SAP").prop('disabled', false); // Deshabilita el botón
                }

                // Actualiza el valor del campo
                this.value = value;

                // Restablece la posición del cursor
                this.setSelectionRange(cursorPosition, cursorPosition);


                if ($('#txtNroDocMIRO').val().trim() == "" && $('#txtNroDocFI').val().trim() == "" && !$("#error-message").is(":visible")) {
                    $('#btn-Gen-Reg-SAP').prop('disabled', false);
                } else {
                    $('#btn-Gen-Reg-SAP').prop('disabled', true);
                }


            });



            $("#btn-Grabar").on('click', function () {

            
                //Nuevo SUNAT -  ssuarez- Armar objeto para SUNAT
                const dataSunat = {
                    numRuc: $("#FromDashProvReg").val(),
                    codComp: $("#cboTipDocReg").val(),
                    numeroSerie: $("#txtNroDocReg").val().split('-')[0],
                    numero: $("#txtNroDocReg").val().split('-')[1],
                    fechaEmision: $("#XMLFechaEmision").val(),
                    monto: $("#txtImpTotReg").val()
                };

                // Validar con SUNAT primero
                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Documento/ValidarSunat',
                    type: 'POST',
                    data: JSON.stringify(dataSunat),
                    contentType: 'application/json',
                    success: function (res) {

                        if (res.success && res.data.estadoCp === "1") {
                            //  SUNAT OK → ahora sí guarda
                            Documento._Operation.fnInsDocumentoIdentity();
                        } else {
                            Uti.Modal.Message("SUNAT", "El comprobante no es válido en SUNAT", Uti.Message.Type.Error);
                        }

                    },
                    error: function () {
                        Uti.Modal.Message("Error", "No se pudo validar con SUNAT", Uti.Message.Type.Error);
                    }
                });
                ///fin ssuarez sunat 


                if ($("#FromEyeIdDocument").val() !== "") { //Actualizar Documento

                    if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.Observado) {

                        if ($("#cboMotObsReg").val() == "") {
                            Uti.Modal.Toastify('Eliga un motivo de observación.', Uti.Message.Type.Aviso);
                        } else {

                            if ($("#FromEyesEstado").val() == Uti.Variable.EstadoStatus.Observado && $("#FromDashUserProfileType").val() == Uti.Variable.ProfileType.Proveedor) {
                                Uti.Modal.Toastify('Solo se puede Anular.', Uti.Message.Type.Aviso);
                            } else {
                                if ($("#txtNroDocMIRO").val().trim() != "" || $("#txtNroDocFI").val().trim() != "" || $("#chkConSAP").is(':checked') == true) {
                                    Uti.Modal.Toastify('Debe eliminar el miro, fi y desmarcar el flag del doc. contableSAP.', Uti.Message.Type.Aviso);
                                } else {
                                    Documento._Operation.fnUpdObsDocumento();
                                }


                            }


                        }

                    } else if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.RecibidoConforme) {

                        if ($("#FromEyesEstado").val() == Uti.Variable.EstadoStatus.RecibidoConforme) {


                            Documento._Operation.fnUpdAprDocumento($("#FromEyeIdDocument").val(), "S", "");

                        } else {
                            Documento._Operation.fnUpdAprDocumento($("#FromEyeIdDocument").val(), "N", "");
                            $("#cboMotObsReg").val("");
                            $("#ConformidadComentarioTxtArea").val("");

                        }

                    } else if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.Recepcionado) {
                        //Uti.Modal.Toastify('El estado sigue en Recepcionado', Uti.Message.Type.Aviso);

                        //Debe eliminar el miro y fi para continuar
                        if ($("#txtNroDocMIRO").val() != "" || $("#txtNroDocFI").val() != "" || $("#chkConSAP").is(':checked') == true) {
                            Uti.Modal.Toastify('Debe eliminar el miro, fi y desmarcar el flag del doc. contableSAP.', Uti.Message.Type.Aviso);
                        } else {
                            Documento._Operation.fnUpdComenSegui();
                        }



                    } else if ($("#cboEstadosReg").val() == Uti.Variable.EstadoStatus.Anulado) {

                        if ($("#cboMotObsReg").val() == "") {
                            Uti.Modal.Toastify('Eliga un motivo de anulación.', Uti.Message.Type.Aviso);
                        } else if ($("#txtNroDocMIRO").val() == "" && $("#txtNroDocFI").val() == "" && $("#chkConSAP").is(':checked') == false) {
                            Documento._Operation.fnUpdAnuDocumento($("#FromEyeIdDocument").val(), 'N');
                        } else {
                            Uti.Modal.Toastify('Debe blanquear el Número MIRO, FI y desmarcar el flag de doc. SAP.', Uti.Message.Type.Aviso);
                        }

                    } else {
                        Uti.Modal.Toastify('Seleccione un estado válido.', Uti.Message.Type.Aviso);
                    }

                } else { //Inserta Nuevo Documento
                    //Documento._Operation.fnInsCabDocumento();
                    //Documento._Operation.fnInsCabDocumentoConDocAdjuntados();
                    Documento._Operation.fnInsDocumentoIdentity();
                }

            });



            $('#btn-Volver').on('click', function () {
                //Viene del Dashboard de la OC Pendientes por Registrar
                if ($('#FromDashOC').val() != '') {
                    window.location.href = Uti.Url.Base + '/Dashboard';
                } else {
                    $('.card-body ul li a[href="#tab-search"]').tab('show');

                    const idEye = $("#FromEyeIdDocument").val();

                    Documento._Search.fnDocumentoSearch(idEye);
                }


            });



        },
        _FrmModalProveedorBuscar: function () {


            // Manejar eventos de ambos campos
            $('#txt-Modal-RUC, #txt-Modal-Proveedor').on('input', Documento._Modal.fnfiltrarTabla);


            $('#txt-Modal-RUC').on('keypress', function (e) {
                // Permitir solo números (códigos de tecla 48-57 corresponden a 0-9)
                if (e.which < 48 || e.which > 57) {
                    e.preventDefault();
                }
            });



            $('#btn-modal-proveedor-aceptar').on('click', function () {
                const rowData = $('#list-proveedor tr input:checkbox[name=chkOpcion]:checked');
                if (rowData.length == 1) {

                    $('#hdcod_Proveedor').val(rowData.attr('cod_prov'));
                    $('#txtProveedor').val(rowData.attr('nom_prov'));
                    Documento._Modal.fnProveedorClose();
                }
                else if (rowData.length > 1) {
                    Uti.Modal.Toastify('Eliga solo un Proveedor', Uti.Message.Type.Alerta);
                } else {
                    $('#hdcod_Proveedor').val('');
                    $('#txtProveedor').val('');
                    Documento._Modal.fnProveedorClose();
                }
            });




        },
        _FrmModalTracking: function () {


            //ModalJS
            $(document).on('keydown', function (event) {
                if (event.key === 'ArrowLeft') {
                    Documento._Modal.fnMoveLeft();
                } else if (event.key === 'ArrowRight') {
                    Documento._Modal.fnMoveRight();
                }
            });

            $("#prevStepButton").on('click', function () {
                Documento._Modal.fnMoveLeft();
            });
            $("#nextStepButton").on('click', function () {
                Documento._Modal.fnMoveRight();
            });
            //ModalJS

        }
    };

    Documento._Init();

});