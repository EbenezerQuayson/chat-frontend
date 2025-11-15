<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
session_start();
include_once "config.php";

$response = ["status" => "error", "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    $sql = mysqli_query($conn, "SELECT * FROM users WHERE email = '{$email}'");

    if (mysqli_num_rows($sql) > 0) {
        $user = mysqli_fetch_assoc($sql);

        // verify password
        if (password_verify($password, $user['password'])) {
            $_SESSION['unique_id'] = $user['unique_id'] ?? uniqid();
            $_SESSION['fname'] = $user['fname'];
            $_SESSION['lname'] = $user['lname'];
            $_SESSION['image'] = $user['image'] ?? "";

            $response = [
                "status" => "success",
                "message" => "Login successful",
                "user" => [
                    "unique_id" => $user['unique_id'],
                    "fname" => $user['fname'],
                    "lname" => $user['lname'],
                    "email" => $user['email'],
                    "image" => $user['img'] ?? ""
                ]
            ];
        } else {
            $response = ["status" => "error", "message" => "Incorrect password"];
        }
    } else {
        $response = ["status" => "error", "message" => "Email not found"];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>
