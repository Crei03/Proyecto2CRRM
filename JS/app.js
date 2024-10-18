
$(document).ready(function() {
    // Cargar proveedores al cargar la página
    numeroCheque();
    cargarProveedores();

    const convertidor = new NumeroATexto();
    
    //mostrar el monto cuando se cambie el valor
    $('#montoCheque').on('change', function() {
        $('#letrasCheque').val(convertidor.convertir($(this).val()));
    });

    $('#observacionesCheque').on('input', function() {
        var caracteresIngresados = $(this).val().length;
        $('#contador').text(`${caracteresIngresados}/250 caracteres`);
    });



    $(".solo-letras").on("input", function() {
        var input = $(this);
        var valor = input.val();

        var soloLetras = /^[a-zA-Z\s]*$/;
    
        if (!soloLetras.test(valor)) {
            input.val(valor.slice(0, -1));
        } 
    });

    $(".solo-numeros").on("input", function() {
        var input = $(this);
        var valor = input.val();
    
        
        var soloNumeros = /^\d+(\.\d{1,2})?$/; 
    
        if (!soloNumeros.test(valor)) {
            input.val(valor.replace(/[^0-9\.]/g, '').replace(/(\.\d{2})\d+/, '$1'));
        }
    });

    $('#panel-cheque').show();

    // Función para manejar el clic en las pestañas
    $('.pestana').on('click', function() {
        // Remover clase active de todas las pestañas
        $('.pestana').removeClass('active');
        // Agregar clase active a la pestaña seleccionada
        $(this).addClass('active');

        // Ocultar ambos paneles
        $('#panel-cheque, #panel-proveedor').hide();

        // Mostrar el panel correspondiente al hacer clic
        if ($(this).attr('id') === 'cheque-tab') {
            $('#panel-cheque').show();
        } else if ($(this).attr('id') === 'proveedor-tab') {
            $('#panel-proveedor').show();
        }
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
