<?php
$servidor = "localhost";
$usuario = "d42024";
$password = "1234";
$base_datos = "cheque";

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(array('status' => 'error', 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error)));
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'cheque') {
    // Obtener el último número de cheque
    $query = "SELECT numero_cheque FROM cheques ORDER BY numero_cheque DESC LIMIT 1";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $cheque = array('numero_cheque' => $row['numero_cheque']);
    } else {
        $cheque = array('status' => 'error', 'message' => 'No se encontró ningún cheque.');
    }

    // Devolver el cheque en formato JSON
    header('Content-Type: application/json');
    echo json_encode($cheque, JSON_PRETTY_PRINT);
}

// Manejo de solicitud POST (para insertar cheque)
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cheque'])) {
    $cheque = $_POST['cheque'];

    // Sanitizar los datos recibidos
    $fecha = $conn->real_escape_string($cheque['fecha']);
    $proveedor_id = $conn->real_escape_string($cheque['proveedor_id']);
    $monto = floatval($cheque['monto']);
    $monto_en_letras = $conn->real_escape_string($cheque['monto_en_letras']);
    $observaciones = $conn->real_escape_string($cheque['observaciones']);

    // Consulta para insertar los datos en la tabla "cheques"
    $sql = "INSERT INTO cheques (fecha, proveedor_id, monto, monto_en_letras, observaciones) 
            VALUES ('$fecha', '$proveedor_id', '$monto', '$monto_en_letras', '$observaciones')";

    if ($conn->query($sql) === TRUE) {
        // Devolver respuesta exitosa en formato JSON
        echo json_encode(['status' => 'success']);
    } else {
        // Devolver respuesta de error en formato JSON
        echo json_encode(['status' => 'error', 'message' => $conn->error]);
    }
} 

// Si no se cumplen las condiciones anteriores, devolver un error
else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No se enviaron datos correctamente.']);
}

// Cerrar la conexión
$conn->close();