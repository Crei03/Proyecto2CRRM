$(document).ready(function(){

    $('#enviar').click(function() {
        sendCheque();
    });

    function sendCheque(){
        const cheque = {
            fecha: $('#fechaCheque').val(),
            proveedor_id: $('#proveedorCheque').val(),
            monto: parseFloat($('#montoCheque').text().trim().replace(/[^0-9.-]+/g, ''))||0,
            monto_en_letras: $('#letrasCheque').val(),
            observaciones: $('#observacionesCheque').val()
        }

        $.ajax({
            type: 'POST',
            url: 'bd.php',
            data: { cheque },
            success: function(response) {
                console.log(response);
                try {
                    let jsonResponse = JSON.parse(response);
                    if (jsonResponse.status == 'success') {
                        alert('Cheque enviado correctamente');
                    } else {
                        alert('Error al enviar cheque: ' + jsonResponse.message);
                    }
                } catch (error) {
                    console.error("Error al enviar cheque", error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error al enviar los datos: ' + textStatus, errorThrown);
            }
        });   
    }
});