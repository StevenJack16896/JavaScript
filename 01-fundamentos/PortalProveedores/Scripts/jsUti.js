var Uti = function () {
    return {
        Url: {
            Base: $('#UrlBase').val()
        },
        DataTable: {
            sUrl: $('#UrlBase').val() + '/Scripts/spanish-config.txt',
            iDisplayLength: {
                NumRows5: 5,
                NumRows10: 10,
                NumRows15: 15,
                NumRows20: 20,
                NumRows25: 25,
                NumRows30: 30,
                NumRows35: 35,
                NumRows40: 40,
                NumRows45: 45,
                NumRows50: 50
            },
            _fnAjaxUpdate: function (IdTabla) {
                $('#' + IdTabla).dataTable()._fnAjaxUpdate();
            }
        },
        Convert: {
            String: {

            },
            Numeric: function (valor) {
                vari = String($.trim(valor) == '' ? 0 : valor).split(',').join('');
                return parseFloat(vari);
            },
            Integer: function (valor) {
                return parseInt(valor);
            },
            Base64ToArrayByte: function (cadenaBase64) {
                var binaryString = window.atob(cadenaBase64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                for (var i = 0; i < binaryLen; i++) {
                    var ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                }
                return bytes;
            }
        },
        Download: {
            /*
            Blob: function (ByteArray, FileName) {
                var blob = new Blob([ByteArray]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);               
                link.download = FileName;
                link.click();
            },
            */
            Bytes: function (ByteArray, FileName) {
                var bytes = new Uint8Array(ByteArray);
                var blob = new Blob([bytes]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = FileName;
                link.click();
            },
            Base64: function (cadenaBase64, FileName) {
                var ArrayByte = Uti.Convert.Base64ToArrayByte(cadenaBase64);
                var blob = new Blob([ArrayByte]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = FileName;
                link.click();
            }            
        },
        Format: {
            Numeric2: function (valor) {
                const num = Uti.Convert.Numeric(valor);
                var m = Number((Math.abs(num) * 100).toPrecision(15));
                return (Math.round(m) / 100 * Math.sign(num)).toFixed(2);
            },
            Numeric: function (valor, decimales = null) {
                const num = Uti.Convert.Numeric(valor);
                if (decimales == null) {
                    return num;
                }
                var m = Number((Math.abs(num) * Math.pow(10, decimales)).toPrecision(15));
                return (Math.round(m) / Math.pow(10, decimales) * Math.sign(num)).toFixed(decimales);
            },
            NumericSeparator: function (valor, decimales = null) {
                const num = Uti.Convert.Numeric(valor);
                if (decimales == null) {
                    return num;
                }
                const newValor = num.toLocaleString('es-PE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
                return newValor;
            }
        },
        Modal: {
            Message: function (title, msg, tipo, funcion = null) {
                $('#btn-modal-accept span').text('Aceptar'), $('#btn-modal-close span').text('Cerrar');
                $('#btn-modal-close').show(), $('#btn-modal-accept').removeAttr('click').hide();
                modal_color_bg = 'modal modal-primary fade';
                alert_icon_bg = 'alert-icon bg-primary';
                alert_icon_img = 'fa fa-check';
                button_close_bg = 'btn btn-danger btn-sm btn-pills waves-effect waves-themed';
                $('#btn-modal-close').show();
                switch (tipo) {
                    case 'Aviso':
                        modal_color_bg = 'modal modal-warning fade';
                        alert_icon_bg = 'alert-icon bg-warning';
                        alert_icon_img = 'fa fa-info'
                        button_close_bg = 'btn btn-warning btn-sm btn-pills waves-effect waves-themed';
                        break;
                    case 'Exito':
                        modal_color_bg = 'modal modal-primary fade';
                        alert_icon_bg = 'alert-icon bg-primary';
                        alert_icon_img = 'fa fa-check'
                        button_close_bg = 'btn btn-primary btn-sm btn-pills waves-effect waves-themed';
                        break;
                    case 'Error':
                        modal_color_bg = 'modal modal-danger fade';
                        alert_icon_bg = 'alert-icon bg-danger';
                        alert_icon_img = 'fa fa-close'
                        button_close_bg = 'btn btn-danger btn-sm btn-pills waves-effect waves-themed';
                        break;
                    case 'Alerta':
                        modal_color_bg = 'modal modal-success fade';
                        alert_icon_bg = 'alert-icon bg-success';
                        alert_icon_img = 'fa fa-close'
                        button_close_bg = 'btn btn-success btn-sm btn-pills waves-effect waves-themed';
                        break;
                    case 'Confirmar':
                        modal_color_bg = 'modal modal-info fade';
                        alert_icon_bg = 'alert-icon bg-info';
                        alert_icon_img = 'fa fa-user-times'
                        button_close_bg = 'btn btn-info btn-sm btn-pills waves-effect waves-themed';
                        $('#btn-modal-accept span').text('Si'), $('#btn-modal-close span').text('No');
                        $('#btn-modal-accept').show();
                        if (funcion) {
                            $('#btn-modal-accept').attr('onclick', '' + funcion + '').show();
                        }
                        break;
                    case 'Session':
                        modal_color_bg = 'modal modal-info fade';
                        alert_icon_bg = 'alert-icon bg-info';
                        alert_icon_img = 'fa fa-user-times'
                        button_close_bg = 'btn btn-info btn-sm rounded';
                        $('#btn-modal-close').hide();
                        $('#btn-modal-accept').attr('onclick', '' + funcion + '').show();
                        break;
                }
                if (tipo != undefined || tipo != null) {
                    $('#modal-message .title').html(title);
                    $('#modal-message .mensaje').html(msg);
                    $('#modal-message #alert-icon-bg-msg').removeClass().addClass(alert_icon_bg);
                    $('#modal-message #alert-icon-bg-msg i').removeClass().addClass(alert_icon_img);
                    $('#modal-message #btn-modal-accept').removeClass().addClass(button_close_bg);
                    $('#modal-message #btn-modal-close').removeClass().addClass(button_close_bg);
                  //$('#modal-message').removeClass().addClass(modal_color_bg);
                    $('#modal-message').modal('show');
                }
            },
            Process: function (modo, msg) {
                if (modo == 'open') {
                    if (!msg) msg = 'Procesando..';
                    $('body').prepend("<div id='ajax-overlay'><div id='ajax-overlay-body' class='center'><i class='fal fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only' style='position:relative'><br/>" + msg + "</span></div></div>");
                    $('#ajax-overlay').css({
                        position: 'absolute',
                        color: '#FFFFFF',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        background: 'rgba(39, 38, 46, 0.67)',
                        'text-align': 'center',
                        'z-index': '9999'
                    });
                    $('#ajax-overlay-body').css({
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        width: '120px',
                        height: '48px',
                        'margin-top': '-12px',
                        'margin-left': '-60px',
                        //background: 'rgba(39, 38, 46, 0.1)',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        'border-radius': '10px'
                    });
                    $('#ajax-overlay').fadeIn(50);
                }
                else {
                    $('#ajax-overlay').fadeOut(100, function () {
                        $('#ajax-overlay').remove();
                    });
                }
            },
            Session: function () {
                $('#modal-message').modal('hide');
                $('#ajaxModal').remove();
                $('.modal-backdrop').remove();
                $remote = $('#lock-screen').attr('data-url');
                $('body').removeClass('modal-open');
                $modal = $('<div class="modal fade" id=ajaxModal><div class="modal-body"></div></div>');
                $('body').append($modal);
                $modal.modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $modal.load($remote);
            },
            Form: function (title, formlulario) {
                $('button[name="btn-modal-comun"]').hide();
                $('button[name="btn-modal-comun"]').removeAttr('click');
                $('#btn-modal-comun').show();
                $('#modal-comun .title').html(title);
                $('#modal-comun .formulario').html(formlulario);
                //  $('#modal-comun .modal-footer').html(button);
                $("#modal-comun").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            },
            Toastify: function (message, type) {

                switch (type) {
                    case 'Aviso':
                        type = 'bg-warning'
                        break;
                    case 'Exito':
                        type = 'bg-primary'
                        break;
                    case 'Error':
                        type = 'bg-danger'
                        break;
                    case 'Alerta':
                        type = 'bg-success'
                        break;
                    case 'Session':
                        type = 'bg-primary'
                        break;
                }

                Toastify({
                    text: message,
                    className: type,
                    duration: 3000,                   
                    newWindow: true,
                    close: true,
                    gravity: "top", 
                    position: "right",
                    stopOnFocus: true,                   
                    onClick: function () { }  
                }).showToast();
 
            }
        },
        Message: {
            Title: {
                AssistantSearch: $('#AssistantSearch').text(),
                AssistantOperation: $('#AssistantOperation').text(),
                AssistantDetalleLinea: $('#AssistantDetalleLinea').text(),
                AssistantSession: $('#AssistantSession').text()
            },
            Type: {
                Error: 'Error',
                Alerta: 'Alerta',
                Aviso: 'Aviso',
                Confirmar: 'Confirmar',
                Exito: 'Exito'
            },
            Description: {
                ErrorAjax: $('#ErrorAjax').text(),
                ProcessInformation: $('#ProcessInformation').text(),
                LoadingInformation: $('#LoadingInformation').text(),
                NotFoundInformation: $('#NotFoundInformation').text(),
                QuestionDelete: $('#QuestionDelete').text(),
                QuestionCopyKPI: $('#QuestionCopyKPI').text(),
                RequiredDetalleLinea: $('#RequiredDetalleLinea').text(),
                RequiredSeleccionarDetalleLinea: $('#RequiredSeleccionarDetalleLinea').text(),
                ExistUsuariosKPI: $('#ExistUsuariosKPI').text(),
                QuestionUpdate: $('#QuestionUpdate').text(),
                VerifyExpiredSession: $('#VerifyExpiredSession').text(),
                RequiredMoreTimeout: $('#RequiredMoreTimeout').text()
            }
        },
        Image: {
            Default: function (idimg) {
                $('#' + idimg).attr({ 'data-src': 'holder.js/200x150/blankon/text:Static image', 'src': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjYwLjcyNjU2MjUiIHk9Ijc1IiBzdHlsZT0iZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQ7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+U3RhdGljIGltYWdlPC90ZXh0PjwvZz48L3N2Zz4=' });
            },
            Preview: function (idImg, base64Img) {
                if (base64Img == 'sin_imagen') {
                }
                else {
                    $('#' + idImg).attr('src', '' + base64Img + '');
                }
            },
            PersonBycPerCodigo: function (idimg, cPerCodigo) {
                $.ajax({
                    url: Uti.Url.Base + '/Imagen/FotoPersonaBase64BycPerCodigo',
                    type: 'POST',
                    async: true,
                    data: { cPerCodigo: cPerCodigo },
                    beforeSend: function () { $('#' + idimg).attr('src', '' + Uti.Url.Base + '/Content/img/loader/general/preload_cuadro_azul_32x32_2.gif'); },
                    success: function (result) {
                        if (result == 'sin_foto') {
                            Uti.Image.Default(idimg);
                        }
                        else {
                            $('#' + idimg).attr('src', '' + result + '');
                        }
                    },
                    error: function () { },
                    complete: function () { }
                })
            }
        },
        KeyBoard: {
            Letters: function (e) {
                tecla = (document.all) ? e.keyCode : e.which; // 2
                if (tecla == 8) return true; // 3
                patron = /[A-Za-zñÑáéíóúÁÉÍÓÚ\s]/; // 4   
                te = String.fromCharCode(tecla); // 5
                return patron.test(te); // 6
            },
            Numbers: function (e) {
                var key = window.Event ? e.which : e.keyCode;
                return ((key >= 48 && key <= 57) || (key == 8));
            },
            LettersAndNumbers: function (e) {
                tecla = (document.all) ? e.keyCode : e.which; // 2
                if (tecla == 8) return true; // 3
                patron = /[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s]/; // 4   
                te = String.fromCharCode(tecla); // 5
                return patron.test(te); // 6
            },
            Decimal: function (evt, control, num_decimales) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
                    return false;
                else {
                    var len = $(control).val().length;
                    var index = $(control).val().indexOf('.');
                    if (index > 0 && charCode == 46) {
                        return false;
                    }
                    if (index > 0) {
                        var CharAfterdot = (len + 1) - index;
                        if (CharAfterdot > num_decimales + 1) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        Variable: {
            EstadoStatus: {
                Recepcionado: "REG",
                RecibidoConforme: "APR",
                Anulado: 'ANU',
                Observado: 'OBS'
            },
            Colour: {
                TextRed: 'ROJO',
                UrlRed: $('#UrlBase').val() +"/Content/assets/images/semaforos/rojo.JPG",
                TextGreen: 'VERDE',
                UrlGreen: $('#UrlBase').val() + "/Content/assets/images/semaforos/verde.JPG",
                TextYellow: 'AMARILLO',
                UrlYellow: $('#UrlBase').val() + "/Content/assets/images/semaforos/amarillo.JPG"
            },
            ProfileType: {
                Admin: '0',
                Almacén: '1',
                Proveedor: '2',
                Logística: '6'
            },
            VariationType: {
                VariarEvaluacion: 1,
                VariarAlcance: 2
            },
            ConditionType: {
                Aprobar: 1,
                Rechazar: 2,
                Retornar: 3,
                RetornarAux: -3
            }
        },
        HttpsServices: {

        },
        Date: {
            Today: function () {
                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var current_date = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + date.getFullYear();
                return current_date;
            },
            NewByDateDays(fecha, dias) {
                var Fecha = new Date();
                var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
                var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
                var aFecha = sFecha.split(sep);
                var fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];
                fecha = new Date(fecha);
                fecha.setDate(fecha.getDate() + parseInt(dias));
                var anno = fecha.getFullYear();
                var mes = fecha.getMonth() + 1;
                var dia = fecha.getDate();
                mes = (mes < 10) ? ("0" + mes) : mes;
                dia = (dia < 10) ? ("0" + dia) : dia;
                var fechaFinal = dia + sep + mes + sep + anno;
                return fechaFinal;
            },
            DaysByMonthYear(month, year) {
                return new Date(year || new Date().getFullYear(), month, 0).getDate();
            },
            Time: function () {
                var dt = new Date();
                var hours = dt.getHours(); // da el valor en formato de 24 horas
                var minutes = dt.getMinutes();
                var finalTime = (hours < 9 ? '0' + hours : hours) + ":" + (minutes < 9 ? '0' + minutes : minutes);
                return finalTime  // final time Time - 22:10
            }
        },
        Autocomplete: {
            Completar: function (ctrl, len) {
                var numero = ctrl.value;
                if (numero.length == len || numero.length == 0) return true;
                for (var i = 1; numero.length < len; i++) {
                    numero = '0' + numero;
                }
                ctrl.value = numero;
                return true;
            }
        },
        SetTimeout: {
            Debounce: function (fn, delay = 500) {
                let timeoutID;
                return function (...args) {
                    if (timeoutID) clearTimeout(timeoutID);
                    timeoutID = setTimeout(() => {
                        fn(...args)
                    }, delay);
                }
            }
        },
        Screen: {
            Height: document.documentElement.clientHeight,
            Scroll: {
                BodyContent: function () {
                    const headerRightHeight = $('.header-right').height();
                    const headerContentHeight = $('.header-content').height()
                    const footerContentHeight = $('.footer-content').height();
                    const bodyContentHeight = Uti.Screen.Height - (headerRightHeight + headerContentHeight + footerContentHeight + 5);
                    $('#body-content').css({ 'overflow-y': 'scroll', 'height': bodyContentHeight + "px" });
                },
                FormModalComun: function () {
                    $('#body-comun').css({ 'overflow-y': 'scroll', 'height': (Uti.Screen.Height) + "px" });
                }
            }
        }
    }
}();
$(function () {
    $('#span_mensajes').hide();  
});