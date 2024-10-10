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