
$(document).ready(function(){

    validarEnvios();

});
function sendCheque(){
    const cheque = {
        numero_ck: $('#numeroCheque').val(),
        fecha: $('#fechaCheque').val(),
        proveedor_id: $('#proveedorCheque').val(),
        monto: parseFloat($('#montoCheque').val()),
        monto_en_letras: $('#letrasCheque').val(),
        observaciones: $('#observacionesCheque').val()
    }

    $.ajax({
        type: 'POST',
        url: './DB/cheque.php',
        data: { cheque },
        success: function(response) {
            console.log(response);
            try {
                let jsonResponse = response;
                console.log(jsonResponse);
               
                if (jsonResponse.status === 'success') {
                    alert('Cheque enviado correctamente');
                    location.reload(true);
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
    console.log(cheque);
}
function sendProveedor() {
    $.ajax({
        type: 'POST',
        url: './DB/proveedores.php',
        data: { proveedor: { nombre: $('#nombreProveedor').val() } },
        success: function(response) {
            try {
                // Convertir el response en un objeto JSON
                let jsonResponse = JSON.parse(response); 
                console.log('respuesta: ', jsonResponse);

                if (jsonResponse.status === 'success') {
                    alert('Proveedor enviado correctamente');
                    location.reload(true);
                } else {
                    alert('Error al enviar proveedor: ' + jsonResponse.message);
                }
            } catch (error) {
                console.error("Error al enviar proveedor: ", error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al enviar los datos: ' + textStatus, errorThrown);
        }
    });
}


function validarEnvios(){
    $('#enviar-proveedor').on('click', function(event) {

        event.preventDefault();

        let isValid = true;

        let nombreProveedor = $('#nombreProveedor').val().trim();
        if (nombreProveedor === '') {
            isValid = false;
            // Mostrar un mensaje de error (puedes mostrarlo de la forma que prefieras)
           alert('El nombre del proveedor es obligatorio.');
        }

        // Si el formulario es válido, se puede proceder a enviarlo
        if (isValid) {
            sendProveedor();
            
        }
        
    });

    $('#enviar-cheque').on('click', function(event) {
        // Evitar el comportamiento por defecto del botón
        event.preventDefault();

        // Variable para verificar si el formulario es válido
        let isValid = true;

        // Validar el campo "Fecha"
        let fechaCheque = $('#fechaCheque').val().trim();
        if (fechaCheque === '') {
            isValid = false;
            alert('La fecha del cheque es obligatoria.');
        }

        // Validar el campo "Proveedor"
        let proveedorCheque = $('#proveedorCheque').val();
        if (proveedorCheque === '') {
            isValid = false;
            alert('Debe seleccionar un proveedor válido.');
        }

        // Validar el campo "Monto"
        let montoCheque = $('#montoCheque').val().trim();
        if (montoCheque === '' || isNaN(montoCheque)) {
            isValid = false;
            alert('El monto del cheque es obligatorio y debe ser un número válido.');
        }

        // Validar el campo "Observaciones" (si es necesario)
        let observacionesCheque = $('#observacionesCheque').val().trim();
        if (observacionesCheque === '') {
            isValid = false;
            alert('Debe ingresar observaciones.');
        }

        // Si el formulario es válido, se puede proceder a enviarlo

        if (isValid) {
            sendCheque();   
        }//else{
        //      alert("Debe de completar todos los campossssss.");
        // }
    });
}