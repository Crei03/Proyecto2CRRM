
$(document).ready(function() {
    // Cargar proveedores al cargar la página
    numeroCheque();
    cargarProveedores();
    idProveedor();
    cambiarTab();
    validacionees();

    const convertidor = new NumeroATexto();
    
    //mostrar el monto cuando se cambie el valor
    $('#montoCheque').on('change', function() {
        $('#letrasCheque').val(convertidor.convertir($(this).val()));
    });

    $('#observacionesCheque').on('input', function() {
        var caracteresIngresados = $(this).val().length;
        $('#contador').text(`${caracteresIngresados}/250 caracteres`);
    });

    $('#fechaCheque').val(fechaActual());

});

function validacionees() {
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
            // Reemplaza todo excepto números y un solo punto
            input.val(
                valor
                    .replace(/[^0-9.]/g, '')        // Permitir solo números y el punto
                    .replace(/(\..*)\./g, '$1')      // Si ya hay un punto, no permitir otro
                    .replace(/(\.\d{2}).+$/, '$1')   // Limitar a dos dígitos decimales
            );
        }
    });
}

function fechaActual() {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

function cambiarTab() {
    $('#cheque-tab').on('click', function() {
        window.location.href = 'cheque.html';  // Redirigir a cheque.html
    });

    $('#proveedor-tab').on('click', function() {
        window.location.href = 'proveedor.html';  // Redirigir a proveedor.html
    });
}

function idProveedor() {
    $.ajax({
        type: 'GET',
        url: './DB/proveedores.php',
        data: { action: 'idProveedor' }, 
        success: function(response) {
            if (response.id) {
                var idProveedor = parseInt(response.id) + 1;
                $('#idProveedor').val(idProveedor); 
            } else {
                console.error('No se pudo obtener el id del proveedor. ' + (response.message || ''));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los proveedores: ' + textStatus);
        }
    });
}

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