$(document).ready(function() {
    // Cargar proveedores al cargar la página
    cargarProveedores();

});
function cargarProveedores() {
    $.ajax({
        type: 'GET',
        url: 'bd.php', // Sin parámetros adicionales
        success: function(response) {
            var proveedores = response; // JSON ya es interpretado automáticamente
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


function limpiarOpciones($selectElement) {
    $selectElement.html('<option value="" disabled selected>Seleccione una opción</option>');
}
