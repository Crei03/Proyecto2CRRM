
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

    $(".solo-letras-numeros").on("input", function() {
        var input = $(this);
        var valor = input.val();
    
        // Expresión regular para permitir solo letras y números
        var soloLetrasNumeros = /^[a-zA-Z0-9\s]*$/;
    
        if (!soloLetrasNumeros.test(valor)) {
            // Reemplaza todo lo que no sea letra o número
            input.val(valor.replace(/[^a-zA-Z0-9\s]/g, ''));
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


$(document).ready(function() {
    // Asignar evento de clic al botón de búsqueda (el ícono de lupa)
    $('.buscarButton').on('click', function() {
        // Obtener el valor ingresado en el campo de búsqueda
        var numeroCheque = $('#buscarCheque').val();
        console.log(numeroCheque);
        if (numeroCheque) {
            // Solicitud AJAX para buscar el cheque en la base de datos
            $.ajax({
                type: 'GET',
                url: './DB/cheque.php',  // Ruta hacia tu archivo PHP
                data: { numero_cheque: numeroCheque },  // Enviar el número de cheque al PHP
                success: function(response) {
                    try {
                        // Parsear la respuesta JSON
                        var cheque = response;
                        console.log(typeof(cheque));
                        console.log(cheque);

                        // Verificar si se devolvió un error
                        if (cheque.status === 'error') {
                            alert(cheque.message);  // Mostrar el mensaje de error
                            document.getElementById('Anular-cheque').style.display = 'none';
                            location.reload(true);
                        } else if(cheque.status !== 'error' && cheque.estado === 'vigente') {
                            // Asignar los datos del cheque a los campos del formulario
                            $('#numeroCheque').val(cheque.numero_cheque);
                            $('#fechaCheque').val(cheque.fecha);
                            $('#proveedorCheque').val(cheque.proveedor_id);  // Asegúrate de que coincida con los valores del select
                            $('#montoCheque').val(cheque.monto);
                            $('#letrasCheque').val(cheque.monto_en_letras);
                            $('#observacionesCheque').val(cheque.observaciones);
                            document.getElementById('Anular-cheque').style.display = 'inline-block';
                    
                        }else{
                            alert(`El cheque número: ${cheque.numero_cheque} esta anulado :(`)
                            document.getElementById('Anular-cheque').style.display = 'none';
                        }
                    } catch (e) {
                        console.error("Error al procesar la respuesta: ", e);
                        
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Error en la solicitud AJAX: " + textStatus);
                }
            });
        } else {
            alert('Por favor ingresa un número de cheque.');
        }
    });
});

if (document.getElementById('Anular-cheque')){
    document.getElementById('Anular-cheque').addEventListener('click', function(){
        let numero_cheque = document.getElementById('numeroCheque').value; 
    
        $.ajax({
            type: 'POST',
            url: './DB/cheque.php',
            data: {
                numero_cheque: numero_cheque,
                fecha_anulacion: fechaActual() 
            },
            success: function(response) {
                try {
                    response = response; 
                    if (response.status === 'success') {
                        alert(`Cheque número ${numero_cheque} anulado exitosamente!`);
                        window.location.href = 'cheque.html';
                    } else {
                        alert(`El cheque número ${numero_cheque} no se pudo anular: ${response.message}`);
                    }
                } catch(e) {
                    console.error("Error al procesar la respuesta: ", e);
                }
            },
            error: function(err) {
                console.error("Error en la solicitud AJAX: ", err);
            }
        });
    });
}


    


