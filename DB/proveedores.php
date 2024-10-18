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

// Manejo de solicitud GET (para obtener proveedores)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'proveedores') {
    // Obtener todos los proveedores
    $query = "SELECT id, nombre FROM proveedores";
    $result = $conn->query($query);

    $proveedores = array();
    while ($row = $result->fetch_assoc()) {
        $proveedores[] = $row;
    }

    // Devolver los proveedores en formato JSON
    header('Content-Type: application/json');
    echo json_encode($proveedores, JSON_PRETTY_PRINT);
} 

elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['proveedor'])) {
    $proveedor = $_POST['proveedor'];

    // Sanitizar los datos recibidos
    $nombre = $conn->real_escape_string($proveedor['nombre']);

    // Manejo de solicitud POST (para agregar un proveedor)
    if (!isset($_POST['proveedor'])) {
        die(json_encode(array('status' => 'error', 'message' => 'Falta el nombre del proveedor')));
    }

    $query = "INSERT INTO proveedores (nombre) VALUES ('$nombre')";
    if ($conn->query($query) === TRUE) {
        echo json_encode(array('status' => 'success', 'message' => 'Proveedor agregado correctamente'));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Error al agregar el proveedor: ' . $conn->error));
    }
} else {
    // Si no se proporciona una acción válida, devolver un error
    die(json_encode(array('status' => 'error', 'message' => 'Accion no valida')));
}