$(function () {

    var currentIndex = 1;
    let listaComunicados = [];
    var nroComunicados = 0;
    var vMessage1 = "";
    var dCreate1 = "";

    var Sign = function () {
        var msg = "Cargando...";
        return {
            init: function () {

                $('#alert-danger,#alert-success').hide();
                Sign.signValidation();
                $('#password-addon').on('click', function () {
                    const passwordInput = $('#txtUserPassword');
                    const eyeIcon = $('#eyeIconLoginIndex');
                    const type = passwordInput.attr('type'); // Obtén el tipo actual del input

                    // Cambiar el atributo type y el ícono en consecuencia
                    if (type === 'password') {
                        passwordInput.attr('type', 'text');
                        eyeIcon.removeClass('ri-eye-off-fill').addClass('ri-eye-line');
                    } else {
                        passwordInput.attr('type', 'password');
                        eyeIcon.removeClass('ri-eye-line').addClass('ri-eye-off-fill');
                    }
                });

                
                Sign.fnGetComunicadosShow();

                if ($("#FromLoginId").val() > 0 ) {
                    $("#ScheduleOS").modal('show');

                    //$("#txtSO").text($("#FromLoginvOutOfRangeMessage").val());

                    // Normalizar los saltos de línea y dividir la cadena
                    var MensajeHorario = $("#FromLoginvOutOfRangeMessage").val().split(/\r?\n/);
                    

                    $.each(MensajeHorario, function (index, value) {
                        if (value.trim() !== "") {  // Ignorar líneas vacías
                            $("#txtSO").append("<p>" + value + "</p>");
                        } else {
                            $("#txtSO").append("</br>");
                        }
                    });

                 


                    currentIndex--;
                } 
                                
               
                $(document).on('click keydown', function (e) {
                    if (e.type === 'click' || e.keyCode === 27) {
                        Sign.fnShowNextMessage();
                    }
                });


                $("#ManualPDF").on('click', function () {
                    Sign.fnGetManualPDF();
                });


               
                
            },
            signBaseURL: function () {
                return $('#UrlBase').val();
            },
            signValidation: function () {               
                $('#frmLogin').validate({
                    invalidHandler:
                        function () {
                        },
                    rules: {
                        UserName: { required: true },
                        UserPassword: { required: true }
                    },
                    messages: {
                        UserName: { required: "Ingrese usuario" },
                        UserPassword: { required: "Ingrese contrase&ntilde;a" }
                    },
                    errorPlacement: function errorPlacement(error, element) {                         
                        var $parent = $(element).parents(".error-placeholder");
                        if ($parent.find(".jquery-validation-error").length) {
                            return;
                        }
                        $parent.append(
                            error.addClass("invalid-feedback")
                        );
                        if (element.parents('.invalid-feedback').length) {
                            error.insertAfter(element.parent());
                        } else {
                            error.insertAfter(element);
                        }
                    },
                    highlight: function (element) {                         
                        const $el = $(element);
                        $el.parents(".error-placeholder");
                        $el.addClass("is-invalid");                       
                    },
                    unhighlight: function (element) {                    
                        $(element).parents('.mb-3').find(".is-invalid").removeClass("is-invalid");                        
                    },


                    submitHandler: function (form) {
                        $('#alert-danger,#alert-success').hide();                       
                        var btn = $('#login-btn');
                        btn.html('Conectandose ...');
                        btn.attr('disabled', 'disabled');
                        $.ajax({
                            url: Sign.signBaseURL() + '/Authenticate/Authenticate', 
                            method: "POST",
                            data: $(form).serialize(),
                            cache: false,
                            statusCode: {
                                401: function () {
                                    $(".lblRespuesta").html("Las credenciales son incorrectas.");
                                    $('#alert-danger').show();
                                },
                                404: function () {
                                    $(".lblRespuesta").html("El recurso no esta disponible, contactese con el administrador del sistema.");                                    
                                    $('#alert-danger').show();
                                },
                                200: function () { },
                                201: function () { },
                                202: function () { },
                                500: function () {
                                    $(".lblRespuesta").html("Internal Server Error, contactese con el administrador del sistema.");
                                    $('#alert-danger').show();
                                }
                            },
                            beforeSend: function (xhr) {
                                setTimeout(function () { btn.text('Espere por favor ...'); }, 1400);
                            },
                            success: function (response, callback) {                               
                                setTimeout(function () {
                                    $(".lblRespuesta").html(response.Message);
                                    if (response.Url == null || response.Url == "") {
                                        $('#alert-danger').show();
                                    }
                                    else {
                                        $('#alert-success').show();
                                    }
                                }, 2000);
                                if (response.Url == null || response.Url == "") {                                   
                                    setTimeout(function () { btn.removeAttr('disabled').html('Iniciar sesi&oacute;n'); }, 2500);                                    
                                }
                                else {                                  
                                    setTimeout(function () { location.href = Sign.signBaseURL() + "/" + response.Url; }, 2500);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                btn.removeAttr('disabled').html('Iniciar sesi&oacute;n');
                                setTimeout(function () { $(".lblRespuesta").html(''); $('#alert-danger').hide(); }, 20000);
                            },
                            failure: function (response, status) { alert(response); }
                        });
                    }
                });
            },

            fnGetComunicadosShow: function () {

                $.ajax({
                    
                    url: Sign.signBaseURL() + '/Login/GetComunicadosShow',
                    type: 'GET',
                    async: true,
                    cache: false,
                    data: {
                    },
                    success: function (resultado) {

                        if (resultado.Session == false) {
                            
                        }
                        else if (resultado == null) {

                        } else {

                            for (var i = 0; i < resultado.length; i++) {

                                // Normalizar los saltos de línea y dividir la cadena
                                var lineas = resultado[i].vMessage.split(/\r?\n/);
                                
                                $.each(lineas, function (index, value) {
                                    if (value.trim() !== "") {  // Ignorar líneas vacías


                                        // Transformar *texto* en <strong>texto</strong>
                                        var valueFormateado = value.replace(/\*(.*?)\*/g, '<strong>$1</strong>');



                                        $("ul#ListaComunicados").append("<p>" + valueFormateado + "</p>");
                                        //$("ul#ListaComunicados").append("<li>" + valueFormateado + "</li>");
                                    } else {
                                        $("ul#ListaComunicados").append("</br>");
                                    }
                                });

                                vMessage1 = resultado[0].vMessage;
                                dCreate1 = Sign.fnDateTimetoString(resultado[0].dCreate);

                                let comunicado = {
                                    vMessage: resultado[i].vMessage,
                                    dCreate: Sign.fnDateTimetoString(resultado[i].dCreate)
                                };
                                listaComunicados.push(comunicado);
                            }
                            nroComunicados = resultado.length;

                            if ($("#FromLoginId").val() == 0 && resultado.length > 0) {
                                //$('#txtMensajeComunicado').text(vMessage1);

                                $('#txtFechaCreacionMensaje').text(dCreate1);

                                $('#FrmComunicado').modal('show');
                            }
                            

                        }


                    },
                    error: function (xhr, status, error) {
                        window.alert("Error de Comunicados");
                        
                    }
                    
                });
            },

            fnDateTimetoString: function (dateTime) {

                const dateString = dateTime;

                const timestamp = parseInt(dateString.match(/\d+/)[0], 10);

                const date = new Date(timestamp);

                const formattedDate = date.toLocaleString();

                //return formattedDate;

                // Separar la parte de la fecha y la hora
                const [fecha, hora] = formattedDate.split(', ');

                // Separar día, mes y año
                const [dia, mes, año] = fecha.split('/');

                // Convertir el número del mes a nombre del mes
                const meses = [
                    "enero", "febrero", "marzo", "abril", "mayo", "junio",
                    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"
                ];
                const nombreMes = meses[parseInt(mes) - 1];

                // Formatear la fecha
                //const fechaFormateada = `${dia} de ${nombreMes} de ${año}, ${hora}`;
                const fechaFormateada = `${dia} de ${nombreMes} de ${año}`;

                return fechaFormateada;

            },

            fnShowNextMessage: function () {

                $("#ScheduleOS").modal('hide');

                if (currentIndex < listaComunicados.length) {
                    var mensaje = listaComunicados[currentIndex];

                    $('#txtMensajeComunicado').text(mensaje.vMessage);
                    $('#txtFechaCreacionMensaje').text(mensaje.dCreate);

                    $('#FrmComunicado').modal('show');

                    // Incrementa el índice para el siguiente mensaje
                    currentIndex++;
                } else {
                        // Cierra el modal cuando se han mostrado todos los mensajes
                        $('#FrmComunicado').modal('hide');
                }
            },

            fnGetManualPDF: function () {

                Sign.showSpinner();

                fetch(Sign.signBaseURL() + '/Login/GetManualPDF', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (response.ok) {

                            return response.blob().then((blob) => {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "Manual_PV_SPM_Recuperar_contraseña.pdf"; // Puedes usar el nombre que desees
                                document.body.appendChild(a);
                                a.click();
                                a.remove(); // Limpieza
                                URL.revokeObjectURL(url); // Liberar memoria
                            });
                        } else {
                            // Si el archivo no existe, manejar la respuesta con código 404
                            return response.text().then((text) => {
                                Uti.Modal.Message("Asistente de búsqueda de información", "Manual no encontrado.", "Alerta");
                            });
                        }
                    })
                    .catch((error) => {
                        // Manejo de errores
                        Uti.Modal.Message("Asistente de búsqueda de información", "Error de Ajax", "Error");
                    })
                    .finally(() => {
                        Sign.hideSpinner();  // Ocultar la pantalla de carga
                    });

            },

            showSpinner: function() {
                $('body').prepend("<div id='ajax-overlay'><div id='ajax-overlay-body' class='center'><span>" + msg + "</span></div></div>");
                $('#ajax-overlay').show();  
            },

            hideSpinner: function () {
                $('#ajax-overlay').fadeOut(100, function () {
                    $('#ajax-overlay').remove();
                });

            }
                       
            
        };
    }();
    Sign.init();
});