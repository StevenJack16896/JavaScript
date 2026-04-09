//*const { Body } = require("node-fetch");

$(function () {

    const Dashboard = {       
        _Init: function () {

            if ($("#UserProfileType").val() == Uti.Variable.ProfileType.Admin) {
                $('#title-menu').text('Dashboard');
                $('#sub-title-menu').text('Dashboard');
                $('#title-opcion').text('');
            } else {
                $('#title-menu').text('Pendientes');
                $('#sub-title-menu').text('Pendientes');
                $('#title-opcion').text('Listado');
            }


            $('#btn-atender').on('click', function () {
                
                /*const rowData = $('#tarea-list-1 tr input:checkbox[name=chkAtender]:checked');*/
                const rowData = $('.chkAtender:checked');
                let nroEntregas = [];
                const IdProveedor = $('#IdProveedor').val();

                if (rowData.length > 1) {

                    var OrdCompraIguales = true;
                    const ordCompra1 = $(rowData[0]).attr('OrdCompra');
                    for (var i = 0; i < rowData.length; i++) {
                        if (ordCompra1 != $(rowData[i]).attr('OrdCompra')) {
                            OrdCompraIguales = false;
                        }
                        
                        nroEntregas.push($(rowData[i]).attr('NroEntrega'));
                    }


                    var allChecked = true;
                    if (OrdCompraIguales) {

                        $('input[name="chkAtender"]').each(function () {
                            if ($(this).attr('OrdCompra') === ordCompra1 && !$(this).is(':checked')) {
                                allChecked = false;
                            }
                        });

                        if (allChecked) {
                            window.alert('Todas las entregas de la OC están marcadas.');
                            Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompra1, nroEntregas.join(',') , "G", "");
                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Faltan OC de Guía por marcar, ¿Desea continuar?', Uti.Message.Type.Confirmar);

                            $('#btn-modal-accept').on('click', function () {
                                Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompra1, nroEntregas.join(','), "G", "");
                            });
                        }

                    } else {
                        Uti.Modal.Toastify('Son diferentes las OC de Guía seleccionadas.', Uti.Message.Type.Aviso);
                    }

                } else if (rowData.length == 1) {
                    
                    const ordCompraUnico = $(rowData).attr('OrdCompra');
                    const nroEntregaUnico = $(rowData).attr('NroEntrega');
                    var allChecked = true;

                    $('input[name="chkAtender"]').each(function () {
                        if ($(this).attr('OrdCompra') === ordCompraUnico && !$(this).is(':checked')) {
                            allChecked = false;
                        }
                    });

                    if (allChecked) {
                        Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompraUnico, nroEntregaUnico, "G", "");
                    } else {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Faltan Nro. Entregas. de Guía por marcar, ¿Desea continuar?', Uti.Message.Type.Confirmar);

                        $('#btn-modal-accept').on('click', function () {
                            Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompraUnico, nroEntregaUnico, "G", "" );
                        });
                    }



                }else{
                    Uti.Modal.Toastify('Ninguna OC de Guía fue seleccionada.', Uti.Message.Type.Error);
                }

            });

            if ($("#UserProfileType").val() == Uti.Variable.ProfileType.Proveedor) {
                Dashboard._Search.fnGetPendientesEntregaSAP($('#IdProveedor').val());
            }
            //else {
            //    Uti.Modal.Message(Uti.Message.Title.AssistantSearch, "No hay pendientes por no ser proveedor.", Uti.Message.Type.Error);
            //}

            $('#btn-atender-hes').on('click', function () {


                /*const rowData = $('#tarea-list-1 tr input:checkbox[name=chkAtender]:checked');*/
                const rowData = $('.chkAtenderHES:checked');
                let nroEntregas = [];
                let nro_HES = [];
                const IdProveedor = $('#IdProveedor').val();

                if (rowData.length > 1) {

                    var OrdCompraIguales = true;
                    const ordCompra1 = $(rowData[0]).attr('OrdCompra');
                    for (var i = 0; i < rowData.length; i++) {
                        if (ordCompra1 != $(rowData[i]).attr('OrdCompra')) {
                            OrdCompraIguales = false;
                        }

                        nroEntregas.push($(rowData[i]).attr('NroEntrega'));
                        nro_HES.push($(rowData[i]).attr('nro_hes'));
                    }


                    var allChecked = true;
                    if (OrdCompraIguales) {

                        $('input[name="chkAtenderHES"]').each(function () {
                            if ($(this).attr('OrdCompra') === ordCompra1 && !$(this).is(':checked')) {
                                allChecked = false;
                            }
                        });

                        if (allChecked) {
                            Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompra1, nroEntregas.join(','), "H", nro_HES.join(',') );
                        } else {
                            Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Faltan OC de HES por marcar, ¿Desea continuar?', Uti.Message.Type.Confirmar);

                            $('#btn-modal-accept').on('click', function () {
                                Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompra1, nroEntregas.join(','), "H", nro_HES.join(','));
                            });
                        }

                    } else {
                        Uti.Modal.Toastify('Son diferentes las OC de HES seleccionadas.', Uti.Message.Type.Aviso);
                    }

                } else if (rowData.length == 1) {

                    const ordCompraUnico = $(rowData).attr('OrdCompra');
                    const nroEntregaUnico = $(rowData).attr('NroEntrega');
                    const nroHESUnico = $(rowData).attr('nro_hes');

                    var allChecked = true;

                    $('input[name="chkAtenderHES"]').each(function () {
                        if ($(this).attr('OrdCompra') === ordCompraUnico && !$(this).is(':checked')) {
                            allChecked = false;
                        }
                    });

                    if (allChecked) {
                        Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompraUnico, nroEntregaUnico, "H", nroHESUnico );
                    } else {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, 'Faltan Nro. Entregas. de HES por marcar, ¿Desea continuar?', Uti.Message.Type.Confirmar);

                        $('#btn-modal-accept').on('click', function () {
                            Dashboard._Search.fnGetDatosOC(IdProveedor, ordCompraUnico, nroEntregaUnico, "H", nroHESUnico);
                        });
                    }



                } else {
                    Uti.Modal.Toastify('Ninguna OC de HES fue seleccionada.', Uti.Message.Type.Error);
                }

            });



            $('#txtNroOCBuscarGuia').on('input', function () {
                var textoBusqueda = $(this).val().toLowerCase();
                $('#tarea-list-1 tr').each(function () {
                    var nombre = $(this).find('td:nth-child(3)').text().toLowerCase();
                    if (nombre.includes(textoBusqueda)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

            $("#chkAtenderAllGUIAS").on("change", function () {
                let isChecked = $(this).prop("checked");
                $("#tarea-list-1 tr:visible .chkAtender").prop("checked", isChecked);
            });



            $('#txtNroOCBuscarHES').on('input', function () {
                var textoBusqueda = $(this).val().toLowerCase();
                $('#tarea-list-HES tr').each(function () {
                    var nombre = $(this).find('td:nth-child(3)').text().toLowerCase();
                    if (nombre.includes(textoBusqueda)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });


            $("#chkAtenderAllHES").on("change", function () {
                let isChecked = $(this).prop("checked");
                $("#tarea-list-HES tr:visible .chkAtenderHES").prop("checked", isChecked);
            });
            

            /*Dashboard._Other.initCheckEvent();*/

        },
        _Clear: {
           
        },
        _Other: {

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

            initCheckEvent: function () {
                // Añade el manejador de eventos para los checkboxes
                $('#chkAtender').on('change', function () {
                    // Obtiene el valor de EBELN del checkbox marcado
                    var ebelnChecked = $(this).attr('OrdCompra');

                    // Recorre los checkboxes para verificar si hay más con el mismo EBELN sin marcar
                    var allChecked = true;
                    $('input[name="chkAtender"]').each(function () {
                        if ($(this).attr('OrdCompra') === ebelnChecked && !$(this).is(':checked')) {
                            allChecked = false;
                        }
                    });

                    // Muestra una alerta si todos los checkboxes con el mismo EBELN están marcados
                    if (allChecked) {
                        alert('Todos los elementos con el EBELN ' + ebelnChecked + ' están marcados.');
                    }
                });
            }

        },
        _Modal: {
         
        },
        _Validation: {
            fnBuscarOCSimilares: function (OrdCompra) {


            }
        },
        _Search: {


            fnGetPendientesEntregaSAP: function (id_proveedor) {


                //1. Lista Pendientes de Guias

                $.ajax({
                    url: Uti.Url.Base + '/Dashboard/GetPendientesEntregaSAP',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: { id_proveedor: id_proveedor },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        }
                        else {
                            $('#tarea-list-1').html('')
                            if (resultado.length > 0) {
                                for (i = 0; i < resultado.length; i++) {

                                    const prop = 'IdProveedor="' + $('#IdProveedor').val() + '" OrdCompra="' + resultado[i].EBELN + '" NroEntrega = "' + resultado[i].BELNR + '"';
                                    const Unique = $('#IdProveedor').val() + resultado[i].EBELN;


                                    body = '<tr>'
                                        /*+ '<td class="text-center" style="text-align:center"><a href="javascript:void(0);" id=slnkNroUnique' + Unique + ' ' + prop + ' class="link-info" style="font-size: 14px;"><i class="ri-record-circle-line"></i>Atender</a></td>'*/

                                        + '<td>'
                                        + '<div class="form-check form-switch-success">'
                                        + '<input class="form-check-input chkAtender" type="checkbox" id="chkAtender" name="chkAtender" ' + prop + ' style="height:25px;width:25px">'
                                        + '<label class="form-check-label"  for= "flexCheckDefault" style="padding-left: 3px " >'
                                        + ' Atender '
                                        + '</label>'
                                        + '</div>'
                                        + '</td> '

                                    if (resultado[i].BUKRS == "1000") {
                                        body += '<td class="text-center">Southern Peaks Mining</td>'
                                    } else if (resultado[i].BUKRS == "2000") {
                                        body += '<td class="text-center">Compañía Minera condestable</td>'
                                    } else {
                                        body += '<td class="text-center">Ariana Operaciones Mineras</td>'
                                    }

                                    body += '<td class="text-center">' + resultado[i].EBELN + '</td>'
                                        + '<td class="text-center">' + resultado[i].BELNR + '</td>'
                                        /*+ '<td class="text-center">' + resultado[i].GJAHR + '</td>'*/
                                        + '<td class="text-center">' + resultado[i].XBLNR + '</td>'
                                        + '<td class="text-center">' + Dashboard._Other.convertDateFormat(resultado[i].BUDAT) + '</td>'
                                        + '<td class="text-center">' + Dashboard._Other.convertDateFormat(resultado[i].BLDAT) + '</td>'
                                        //+ '<td class="text-center">' + resultado[i].LIFNR + '</td>'
                                        //+ '<td class="text-center">' + resultado[i].BELNR_MIRO + '</td>'
                                        + '</tr>';

                                    $('#tarea-list-1').append(body);

                                    //$('#tarea-list-1 #slnkNroUnique' + Unique).on('click', function () {
                                    //    const IdProveedor = $(this).attr('IdProveedor');
                                    //    const OrdCompra = $(this).attr('OrdCompra');

                                    //    Dashboard._Search.fnGetDatosOC(IdProveedor, OrdCompra );
                                    //});

                                }

                                // Inicializa el evento de cambio después de generar las filas
                                /*Dashboard._Other.initCheckEvent();*/

                            } else {

                                
                                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "No hay Guías Pendientes.", Uti.Message.Type.Error);
                                

                                body = "<tr>"
                                    + "<td  colspan='8' style='text-align:center;'>" + "Sin Registros" + "</td>"
                                    //+ "<td></td>"
                                    //+ "<td></td>"
                                    //+ "<td></td>"
                                    //+ "<td></td>"
                                    //+ "<td></td>"
                                    //+ "<td></td>"
                                    + "</tr>"

                                $('#tarea-list-1').append(body);
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) { Uti.Modal.Process(); }
                });


                //2. Lista Pendientes de HES
                $.ajax({
                    url: Uti.Url.Base + '/Dashboard/GetPendientesHesSap',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: { id_proveedor: id_proveedor },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        }
                        else {
                            $('#tarea-list-HES').html('')
                            if (resultado.length > 0) {
                                for (i = 0; i < resultado.length; i++) {

                                    const prop = 'IdProveedor="' + $('#IdProveedor').val() + '" OrdCompra="' + resultado[i].EBELN + '" NroEntrega = "' + resultado[i].BELNR + '" nro_HES = "' + resultado[i].LFBNR + '"';
                                    const Unique = $('#IdProveedor').val() + resultado[i].EBELN;


                                    body = '<tr>'
                                        /*+ '<td class="text-center" style="text-align:center"><a href="javascript:void(0);" id=slnkNroUnique' + Unique + ' ' + prop + ' class="link-info" style="font-size: 14px;"><i class="ri-record-circle-line"></i>Atender</a></td>'*/

                                        + '<td>'
                                        + '<div class="form-check form-switch-success">'
                                        + '<input class="form-check-input chkAtenderHES" type="checkbox" id="chkAtenderHES" name="chkAtenderHES" ' + prop + ' style="height:25px;width:25px">'
                                        + '<label class="form-check-label"  for= "flexCheckDefault" style="padding-left: 3px " >'
                                        + ' Atender '
                                        + '</label>'
                                        + '</div>'
                                        + '</td> '

                                    if (resultado[i].BUKRS == "1000") {
                                        body += '<td class="text-center">Southern Peaks Mining</td>'
                                    } else if (resultado[i].BUKRS == "2000") {
                                        body += '<td class="text-center">Compañía Minera condestable</td>'
                                    } else {
                                        body += '<td class="text-center">Ariana Operaciones Mineras</td>'
                                    }

                                    body += '<td class="text-center">' + resultado[i].EBELN + '</td>' //Nro. Orden Compra
                                        + '<td class="text-center">' + resultado[i].BELNR + '</td>' //Nro. Entrega
                                        /*+ '<td class="text-center">' + resultado[i].GJAHR + '</td>'*/
                                        + '<td class="text-center">' + resultado[i].LFBNR + '</td>' //Nro HES
                                        + '<td class="text-center">' + Dashboard._Other.convertDateFormat(resultado[i].BUDAT) + '</td>' //Fecha de Contabilización HES
                                        + '<td class="text-center">' + Dashboard._Other.convertDateFormat(resultado[i].BLDAT) + '</td>' //Fecha de Documento HES
                                        //+ '<td class="text-center">' + resultado[i].LIFNR + '</td>'
                                        //+ '<td class="text-center">' + resultado[i].BELNR_MIRO + '</td>'
                                        + '</tr>';

                                    $('#tarea-list-HES').append(body);

                                    //$('#tarea-list-1 #slnkNroUnique' + Unique).on('click', function () {
                                    //    const IdProveedor = $(this).attr('IdProveedor');
                                    //    const OrdCompra = $(this).attr('OrdCompra');

                                    //    Dashboard._Search.fnGetDatosOC(IdProveedor, OrdCompra );
                                    //});

                                }

                                // Inicializa el evento de cambio después de generar las filas
                                /*Dashboard._Other.initCheckEvent();*/

                            } else {

                                setTimeout(function () {
                                    Uti.Modal.Message(Uti.Message.Title.AssistantOperation, "No hay HES Pendientes.", Uti.Message.Type.Error);
                                }, 1200);
                                

                                body = "<tr>"
                                            + "<td  colspan='8' style='text-align:center;'>" + "Sin Registros" + "</td>"
                                    + "</tr>"

                                $('#tarea-list-HES').append(body);
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) { Uti.Modal.Process(); }
                });





            },

            fnGetDatosOC: function (IdProveedor, OrdCompra, nroEntregas, GuiaOrHes, nroHES ) {
                window.location.href = 'RRHH/Documento/Index?Provee=' + IdProveedor + '&OrdCompra=' + OrdCompra + '&NroEntregas=' + nroEntregas + '&GuiaOrHes=' + GuiaOrHes + '&nroHES=' + nroHES;
            }
            
        },
        _Operation: {
            fnhashParameter: function(parameter){
                return CryptoJS.SHA256(parameter).toString(CryptoJS.enc.Hex);
            }
        }
    }
    Dashboard._Init();
});