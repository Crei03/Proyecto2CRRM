<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servidor = "localhost";
$usuario = "d42024";
$password = "1234";
$base_datos = "cheque";

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(array('status' => 'error', 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error)));
}

// Manejo de solicitud GET para buscar un cheque por su número
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['numero_cheque'])) {
    $numero_cheque = intval($_GET['numero_cheque']);

    // Consultar el cheque por su número
    $query = "SELECT * FROM cheques WHERE numero_cheque = $numero_cheque";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(array('status' => 'error', 'message' => 'Error en la consulta: ' . $conn->error));
        exit;
    }

    if ($result->num_rows > 0) {
        $cheque = $result->fetch_assoc();
    } else {
        $cheque = array('status' => 'error', 'message' => 'No se encontró ningún cheque con ese número.');
    }

    // Devolver el cheque en formato JSON
    echo json_encode($cheque);
}

// Manejo de solicitud GET para obtener el último número de cheque
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'cheque') {
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
    echo json_encode($cheque);
}

// Manejo de solicitud POST para insertar un nuevo cheque
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cheque'])) {
    $cheque = $_POST['cheque'];

    // Sanitizar los datos recibidos
    $numero_cheque = $conn->real_escape_string($cheque['numero_cheque']);
    $fecha = $conn->real_escape_string($cheque['fecha']);
    $proveedor_id = $conn->real_escape_string($cheque['proveedor_id']);
    $monto = floatval($cheque['monto']);
    $monto_en_letras = $conn->real_escape_string($cheque['monto_en_letras']);
    $observaciones = $conn->real_escape_string($cheque['observaciones']);

    // Verifica si el cheque ya existe
    $checkSql = "SELECT COUNT(*) AS count FROM cheques WHERE numero_cheque = '$numero_cheque'";
    $checkResult = $conn->query($checkSql);
    $row = $checkResult->fetch_assoc();

    if ($row['count'] > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Este cheque ya existe']);
    } else {
        // Si no existe, realiza la inserción
        $sql = "
            INSERT INTO cheques (numero_cheque, fecha, proveedor_id, monto, monto_en_letras, observaciones)
            VALUES ('$numero_cheque', '$fecha', '$proveedor_id', '$monto', '$monto_en_letras', '$observaciones')
        ";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
    }
} 

elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['numero_cheque']) && isset($_POST['fecha_anulacion'])) {
    $numero_cheque = $conn->real_escape_string($_POST['numero_cheque']);
    $fecha_anulacion = $conn->real_escape_string($_POST['fecha_anulacion']);

    // Actualizar el estado a "anulado" para el cheque especificado
    $sql = "UPDATE cheques SET estado = 'anulado', fecha_anulacion = '$fecha_anulacion' WHERE numero_cheque = '$numero_cheque' AND fecha_anulacion IS NULL";


    if ($conn->query($sql) === TRUE) {
        // Verifica si se actualizó alguna fila
        if ($conn->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'El cheque ha sido anteriormente anulado']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => $conn->error]);
    }
}

// Si no se cumplen las condiciones anteriores, devolver un error
else {
    echo json_encode(['status' => 'error', 'message' => 'No se enviaron datos correctamente.']);
}



// } else {
//     echo json_encode(['status' => 'error', 'message' => 'Solicitud inválida']);
// }

// Cerrar la conexión
$conn->close();
