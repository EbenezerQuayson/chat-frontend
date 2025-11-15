<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
include_once "config.php";
$unique_id = $_GET['unique_id'] ?? '';
$response = ["status" => "error", "message" => "No users found"];

$sql = mysqli_query($conn, "SELECT unique_id, fname, lname, email, img FROM users WHERE unique_id != '{$unique_id}'");

if (mysqli_num_rows($sql) > 0) {
    $users = [];
    while ($row = mysqli_fetch_assoc($sql)) {
        $users[] = $row;
    }
    $response = ["status" => "success", "users" => $users];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
