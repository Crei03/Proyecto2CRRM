<?php
$servidor = "localhost";
$usuario = "d42024";
$password = "1234";
$base_datos = "cheque";

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cheque'])) {
    $cheque = $_POST['cheque'];

    // Sanitizar los datos recibidos
    $fecha = $conn->real_escape_string($cheque['fecha']);
    $proveedor_id = $conn->real_escape_string($cheque['proveedor_id']);
    $monto = floatval($cheque['monto']);
    $monto_en_letras = $conn->real_escape_string($cheque['monto_en_letras']);
    $observaciones = $conn->real_escape_string($cheque['observaciones']);

    // Consulta para insertar los datos en la tabla "cheque"
    $sql = "INSERT INTO cheques (fecha, proveedor_id, monto, monto_en_letras, observaciones) 
            VALUES ('$fecha', '$proveedor_id', '$monto', '$monto_en_letras', '$observaciones')";

    if ($conn->query($sql) === TRUE) {
        // Devolver respuesta exitosa en formato JSON
        echo json_encode(['status' => 'success']);
    } else {
        // Devolver respuesta de error en formato JSON
        echo json_encode(['status' => 'error', 'message' => $conn->error]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se enviaron datos correctamente.']);
}

$conn->close();