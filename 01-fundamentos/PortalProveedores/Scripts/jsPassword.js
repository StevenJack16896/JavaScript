
$(function () {

    const Password = {
        _Init: function () {

            $("#title-menu").text("Cambiar Contraseña");
            $("#sub-title-menu").text("Contraseña");
            $("#title-opcion").text("Cambiar contraseña");


            $("#sbtnSavePass").on('click', function () {
                if ($("#txtPassNew").val().trim() !== $("#txtPassConfirm").val().trim()) {
                    Uti.Modal.Toastify('Contraseñas diferentes.', Uti.Message.Type.Aviso);
                } else {
                    Password._Operation.fnUpdPassword();
                }
            });


            $("#txtPassActual").val("");
            $("#txtPassNew").val("");
            $("#txtPassConfirm").val("");

        },
        _Clear: {

        },
        _Other: {

        },
        _Modal: {

        },
        _Validation: {

        },
        _Operation: {

            fnUpdPassword: function(){

                
                $.ajax({
                    url: Uti.Url.Base + '/Password/UpdPassword',
                    type: 'POST',
                    async: true,
                    cache: false,
                    data: {
                        login: $('#IdProveedor').val(),
                        passActual: $("#txtPassActual").val(),
                        passNew: $("#txtPassNew").val(),
                        perfil: $("#UserProfileType").val()
                        
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
                        
                    }
                });
            }


        },
        _Search: {

        }
    };

    Password._Init();

});