<?php
$servidor = "localhost";
$usuario = "d42024";
$password = "1234";
$base_datos = "dbchque";

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
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'idProveedor') {

    $query = "SELECT id FROM proveedores ORDER BY id DESC LIMIT 1";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $proveedor = array('id' => $row['id']); 
    } else {
        $proveedor = array('status' => 'error', 'message' => 'No se encontró ningún proveedor.');
    }

    header('Content-Type: application/json');
    echo json_encode($proveedor, JSON_PRETTY_PRINT);
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['proveedor'])) {
    $proveedor = $_POST['proveedor'];

    // Sanitizar los datos recibidos
    $nombre = $conn->real_escape_string($proveedor['nombre']);

    // Verificar si el proveedor ya existe
    $checkQuery = "SELECT * FROM proveedores WHERE nombre = '$nombre'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Si el proveedor ya existe, devolver un mensaje de error
        echo json_encode(array('status' => 'error', 'message' => 'El proveedor ya existe en la base de datos'));
    } else {
        // Si no existe, proceder a la inserción
        $query = "INSERT INTO proveedores (nombre) VALUES ('$nombre')";
        if ($conn->query($query) === TRUE) {
            echo json_encode(array('status' => 'success', 'message' => 'Proveedor agregado correctamente'));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error al agregar el proveedor: ' . $conn->error));
        }
    }
}
else {
    // Si no se proporciona una acción válida, devolver un error
    die(json_encode(array('status' => 'error', 'message' => 'Accion no valida')));
}