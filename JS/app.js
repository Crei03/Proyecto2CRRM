
$(document).ready(function() {
    // Cargar proveedores al cargar la página
    numeroCheque();
    cargarProveedores();

    const convertidor = new NumeroATexto();
    
    //mostrar el monto cuando se cambie el valor
    $('#montoCheque').on('change', function() {
        $('#letrasCheque').val(convertidor.convertir($(this).val()));
    });

});

function cargarProveedores() {
    $.ajax({
        type: 'GET',
        url: './DB/proveedores.php',
        data: { action: 'proveedores' }, // Agregar el parámetro 'action'
        success: function(response) {
            var proveedores = response; 
            var $selectProveedor = $('#proveedorCheque');

            proveedores.forEach(function(proveedor) {
                var option = $('<option>').val(proveedor.id).text(proveedor.nombre);
                $selectProveedor.append(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los proveedores: ' + textStatus);
        }
    });
}

function numeroCheque() {
    $.ajax({
        type: 'GET',
        url: './DB/cheque.php',
        data: { action: 'cheque' }, // Agregar el parámetro 'action'
        success: function(response) {
            if (response.numero_cheque) {
                var numeroCheque = parseInt(response.numero_cheque) + 1;
                $('#numeroCheque').val(numeroCheque);
            } else {
                console.error('No se pudo obtener el número de cheque. ' + (response.message || ''));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al obtener el número de cheque: ' + textStatus);
        }
    });
}


function limpiarOpciones($selectElement) {
    $selectElement.html('<option value="" disabled selected>Seleccione una opción</option>');
}
