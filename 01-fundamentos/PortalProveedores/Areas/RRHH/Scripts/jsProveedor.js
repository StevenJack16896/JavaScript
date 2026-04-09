
$(function () {

    let RucAdmin = $('#hdcod_Proveedor').val();
    let RucAdminMant = $('#hdcod_Proveedor').val();
    
    const Proveedor = {
        _Init: function () {

            $('#title-menu').text('Mantenimiento de Proveedor');
            $('#sub-title-menu').text('Proveedor');
            $('#title-opcion').text('Proveedor');

            $("#txtRucProveedor").val($('#hdcod_Proveedor').val());
            $("#txtRazonSocialProvee").val($('#hdcod_RazonSocial').val());


            Proveedor._Search.fnGetProveedor(RucAdminMant)
                .then(() => {
                    // Después de que fnGetProveedor complete, llama a fnGetContactos
                    Proveedor._Search.fnGetContactos(RucAdmin);
                });


            $('#txtBuscarContacto').on('input', function () {
                var textoBusqueda = $(this).val().toLowerCase();
                $('#list-contactos-proveedor tr').each(function () {
                    var nombre = $(this).find('td:nth-child(2)').text().toLowerCase();
                    if (nombre.includes(textoBusqueda)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });


            

            $("#btn-Grabar-Proveedor").on('click', function () {
                Proveedor._Operation.fnUpdProveedor();
            });

            $('.js-select2').select2();
         

            $('#scboRazSocProveedor').on('change', function () {
                const labelSelected = $(this).find("option:selected").text(); //RazonSocial
                const valueSelected = $(this).val(); //RUC
                

                if (valueSelected !== "") {
                    RucAdmin = valueSelected;
                    Proveedor._Search.fnGetContactos(RucAdmin);
                } else {
                    RucAdmin = $('#hdcod_Proveedor').val();
                }

            });

            $("#scboRazSocProveedorMant").on('change', function () {
                const labelSelected = $(this).find("option:selected").text(); //RazonSocial
                const valueSelected = $(this).val(); //RUC


                if (valueSelected !== "") {
                    RucAdminMant = valueSelected;
                    Proveedor._Search.fnGetProveedor(RucAdminMant);
                } else {
                    RucAdminMant = $('#hdcod_Proveedor').val();
                }

            });


            $("#btn-Nuevo-Proveedor").on('click', function () {
                Proveedor._Operation.fnInsProveedor();
            });

            
        },
        _Clear: {
            fnCleanParamters: function () {
                $("#txtRucProveedorNuevo").val("");
                $("#txtRazonSocialProveeNuevo").val("");
                /*$("#txtPasswordProveeNuevo").val("");*/

            }
        },
        _Other: {
            
        },
        _Modal: {
          
        },
        _Validation: {
            fnvalidateEmailRegex: function(email) {
                var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailPattern.test(email);
            }
        },
        _Operation: {

            fnUpdContacto: function (codProveedor ,IdDetalle, cEstado ) {

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/UpdContacto',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        IdDetalle: IdDetalle,
                        cRuc: codProveedor,
                        cEstado: cEstado
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                        }


                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) {
                        Uti.Modal.Process();
                        Proveedor._Search.fnGetContactos(RucAdmin);
                    }
                });

            },

            fnInsContacto: function (codProveedor, vcNombreContacto, vcEmailContacto) {

               
                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/InsContacto',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cRuc: codProveedor,
                        vcNombreContacto: vcNombreContacto,
                        vcEmailContacto: vcEmailContacto
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {
                            Uti.Modal.Message(resultado.Title, resultado.Description, resultado.Type, resultado.Function);
                        }


                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) {
                        Uti.Modal.Process();
                        Proveedor._Search.fnGetContactos(RucAdmin);
                    }
                });

            },

            fnUpdProveedor: function () {

                const RucCombo1 = $('#txtRucProveedor').val();
                const RucCombo2 = $("#scboRazSocProveedor").val();

                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/UpdProveedor',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cRuc: RucCombo1,
                        vcRazonSocial: $("#txtRazonSocialProvee").val(),
                        cEstado: $("#rdActivoProvee").is(':checked') ? "1" : "0",
                        vcFlg_XML: $("#validXMLProvee").is(':checked') ? "S" : "X",
                        vcFlg_PDF: $("#validPDFProvee").is(':checked') ? "S" : "X",
                        vcFlg_CDR: $("#validCDRProvee").is(':checked') ? "S" : "X",
                        vcFlg_Importe: $("#VerOCProvee").is(':checked') ? "S" : "X"
                        
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data) {
                        Uti.Modal.Process();
                        if (data.resultado.Session == false) {
                            Uti.Modal.Message(data.resultado.Title, data.resultado.Description, data.resultado.Type);
                            Uti.Modal.Process();
                        }
                        else if (data.resultado == null) {

                        } else {
                            
                            // Actualizar el combo con los nuevos proveedores
                            var combo = $('#scboRazSocProveedorMant');
                            combo.empty(); // Limpiar el combo actual

                            $.each(data.proveedoresActualizados, function (index, proveedor) {
                                combo.append($('<option></option>').val(proveedor.Value).text(proveedor.Label));
                            });
                            combo.val(RucCombo1).trigger('change'); // Seleccionar un valor por defecto si es necesario
                            Uti.Modal.Message(data.resultado.Title, data.resultado.Description, data.resultado.Type, data.resultado.Function);

                            var combo2 = $('#scboRazSocProveedor');
                            combo2.empty();
                            $.each(data.proveedoresActualizados, function (index, proveedor) {
                                combo2.append($('<option></option>').val(proveedor.Value).text(proveedor.Label));
                            });
                            combo2.val(RucCombo2).trigger('change'); // Seleccionar un valor por defecto si es necesario
                            
                        }
                        

                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        Uti.Modal.Process();
                    },
                    complete: function (complete) {
                        Uti.Modal.Process();
                        
                        //setTimeout(function () {
                        //    Proveedor._Search.fnGetProveedor(RucAdminMant);
                        //}, 150); //1.5 segundos

                    }
                });

            },

            fnInsProveedor: function () {


                $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/InsProveedor',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        cRuc: $("#txtRucProveedorNuevo").val(),
                        vcRazonSocial: $("#txtRazonSocialProveeNuevo").val(),
                        vcPassword: $("#txtRucProveedorNuevo").val()
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data) {

                        if (data.resultado.Session == false) {
                            Uti.Modal.Message(data.resultado.Title, data.resultado.Description, data.resultado.Type, data.resultado.Function);
                            Uti.Modal.Process();
                        }
                        else if (data.resultado == null) {

                        } else {
                            Uti.Modal.Message(data.resultado.Title, data.resultado.Description, data.resultado.Type, data.resultado.Function);
                            if (data.resultado.Type == Uti.Message.Type.Exito) {
                                Proveedor._Clear.fnCleanParamters();

                                // Actualizar el combo con los nuevos proveedores
                                var combo = $('#scboRazSocProveedorMant');
                                var comboVal = $('#scboRazSocProveedorMant').val();
                                combo.empty(); // Limpiar el combo actual

                                $.each(data.proveedoresActualizados, function (index, proveedor) {
                                    combo.append($('<option></option>').val(proveedor.Value).text(proveedor.Label));
                                });
                                $('#scboRazSocProveedorMant').val(comboVal);
                                
                                var combo2 = $('#scboRazSocProveedor');
                                var combo2Val = $('#scboRazSocProveedor').val();
                                combo2.empty();
                                $.each(data.proveedoresActualizados, function (index, proveedor) {
                                    combo2.append($('<option></option>').val(proveedor.Value).text(proveedor.Label));
                                });
                                $('#scboRazSocProveedor').val(combo2Val);
                                


                            }
                            
                        }


                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                        Uti.Modal.Process();
                    },

                    complete: function (complete) {
                        Uti.Modal.Process();
                    }
                });

            }


        },
        _Search: {

            fnGetContactos: function (proveedor) {
                                
                return $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/GetContactos',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        CodProveedor: proveedor
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (data) {

                        if (data.Session == false) {
                            Uti.Modal.Message(data.Title, data.Description, data.Type, data.Function);
                            Uti.Modal.Process();
                        }
                        else if (data == null) {

                        } else {
                            $('#list-contactos-proveedor').html('');

                                for (var i = 0; i < data.length; i++) {
                                    const Unique = data[i].IdDetalle;

                                    if (data[i].cEstado == "Inactivo") {
                                        body = '<tr class="">'
                                            + '<td class="text-center tachado">' + data[i].IdDetalle + '</td>'
                                            + '<td class="text-center tachado">' + data[i].vcNombreContacto + '</td>'
                                            + '<td class="text-center tachado">' + data[i].vcEmailContacto + '</td>'
                                            + '<td class="text-center tachado">' + data[i].cEstado + '</td>'
                                    }else {
                                        body = '<tr>'
                                            + '<td class="text-center">' + data[i].IdDetalle + '</td>'
                                            + '<td class="text-center">' + data[i].vcNombreContacto + '</td>'
                                            + '<td class="text-center">' + data[i].vcEmailContacto + '</td>'
                                            + '<td class="text-center">' + data[i].cEstado + '</td>'
                                    }

                                    body   += '<td class="text-center"><a href="javascript:void(0);" id=slnkActContact' + Unique + ' name=slnkActContact' + Unique + ' " class="link-info" style="font-size: 30px"><i class="ri-check-line"></i></a></td>'
                                            + '<td class="text-center"><a href="javascript:void(0);" id=slnkInaContact' + Unique + ' name=slnkInaContact' + Unique + ' " class="link-info" style="font-size: 30px"><i class="ri-close-line"></i></a></td>'
                                            + '</tr>';

                                    $('#list-contactos-proveedor').append(body);


                                    $('#list-contactos-proveedor #slnkActContact' + Unique).on('click', function () {
                                        Proveedor._Operation.fnUpdContacto(RucAdmin, Unique,"1");
                                    });

                                    $('#list-contactos-proveedor #slnkInaContact' + Unique).on('click', function () {
                                        Proveedor._Operation.fnUpdContacto(RucAdmin,Unique, "0");
                                    });


                            }
                            
                            
                            body = '<tr>'
                                + '<td class="text-center">' + "+" + '</td>'
                                + '<td contenteditable="true" class="editable" id="vNombreContacto"></td>'
                                + '<td contenteditable="true" class="editable" id="vEmailContacto"></td>'
                                + '<td colspan="3" class="text-center"><button class="btn btn-info" id="btn-save-contacto" type="button">Grabar</button></td>'
                                + '</tr>';

                            $('#list-contactos-proveedor').append(body);

                        
                            $("#btn-save-contacto").on('click', function () {
                                const nombre = $("#vNombreContacto").text().trim();
                                const correo = $("#vEmailContacto").text().trim();

                                if (nombre == "") {
                                    Uti.Modal.Toastify('Llenar el nombre', Uti.Message.Type.Aviso);
                                    return;
                                }
                                if (correo == "") {
                                    Uti.Modal.Toastify('Llenar el correo', Uti.Message.Type.Aviso);
                                    return;

                                } else if (!Proveedor._Validation.fnvalidateEmailRegex(correo) ) {
                                    Uti.Modal.Toastify('Correo inválido ', Uti.Message.Type.Aviso);
                                    return;
                                }

                                if (nombre !== "" && correo !== "" ) {
                                    Proveedor._Operation.fnInsContacto(RucAdmin ,nombre, correo);
                                }
                                
                            });

                        }
                    },
                    error: function (xhr, status, error) {
                        Uti.Modal.Message(Uti.Message.Title.AssistantOperation, Uti.Message.Description.ErrorAjax, Uti.Message.Type.Error);
                    },

                    complete: function (complete) { Uti.Modal.Process(); }
                });
            },


            fnGetProveedor: function (proveedor) {

                return $.ajax({
                    url: Uti.Url.Base + '/RRHH/Proveedor/GetProveedor',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        ruc: proveedor
                    },
                    beforeSend: function () { Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation); },
                    success: function (resultado) {
                        Uti.Modal.Process();
                        if (resultado.Session == false) {
                            Uti.Modal.Message(data.Title, data.Description, data.Type, data.Function);
                            Uti.Modal.Process();
                        }
                        else if (resultado == null) {

                        } else {

                            $("#txtRucProveedor").val(resultado.cRuc);
                            $("#txtRazonSocialProvee").val(resultado.vcRazonSocial);


                            $("#rdActivoProvee").prop('checked', resultado.cEstado == "1");
                            $("#flexRadioDefault2").prop('checked', resultado.cEstado == "0");

                            $("#validXMLProvee").prop('checked', resultado.vcFlg_XML == "S");
                            $("#validPDFProvee").prop('checked', resultado.vcFlg_PDF == "S");
                            $("#validCDRProvee").prop('checked', resultado.vcFlg_CDR == "S");

                            $("#VerOCProvee").prop('checked', resultado.vcFlg_Importe == "S");


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

                       
        }
    };

    Proveedor._Init();

});