$(function () {

    const Header = {
        _Init: function () {

            $("#ManualPDFDash").on('click', function () {
                Header._Search.fnGetManualPDF();
            });

        },
        _Search: {

            fnGetManualPDF: function() {

                Uti.Modal.Process('open', Uti.Message.Description.LoadingInformation);

                fetch(Uti.Url.Base + "/Dashboard/GetManualPDF", {
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
                                a.download = "Manual_Proveedores_2024.pdf"; // Puedes usar el nombre que desees
                                document.body.appendChild(a);
                                a.click();
                                a.remove(); // Limpieza
                                URL.revokeObjectURL(url); // Liberar memoria
                            });
                        } else {
                            // Si el archivo no existe, manejar la respuesta con código 404
                            return response.text().then((text) => {
                                Uti.Modal.Message(Uti.Message.Title.AssistantSearch, "Manual no encontrado.", Uti.Message.Type.Alerta);
                            });
                        }
                    })
                    .catch((error) => {
                        // Manejo de errores
                        Uti.Modal.Message( Uti.Message.Title.AssistantSearch, error.message, Uti.Message.Type.Error );
                    })
                    .finally(() => {
                        Uti.Modal.Process(); // Ocultar la pantalla de carga
                    });


            }
        }

    }


    Header._Init();
});