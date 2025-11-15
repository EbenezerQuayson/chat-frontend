<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
session_start();
include_once "config.php";

$response = ["status" => "error", "message" => "Unknown error"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // $unique_id = uniqid(rand(), true);
    $unique_id = bin2hex(random_bytes(4)); // 8-character random hex

    $fname = mysqli_real_escape_string($conn, $_POST['fname']);
    $lname = mysqli_real_escape_string($conn, $_POST['lname']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);


    // Hash password before storing
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if email already exists
    $checkEmail = mysqli_query($conn, "SELECT email FROM users WHERE email = '{$email}'");
    if (mysqli_num_rows($checkEmail) > 0) {
        $response = ["status" => "error", "message" => "Email already exists"];
    } else {
        $imageName = null;

        // Handle file upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imgName = $_FILES['image']['name'];
            $tmpName = $_FILES['image']['tmp_name'];
            $imgSize = $_FILES['image']['size'];
            $imgExt = strtolower(pathinfo($imgName, PATHINFO_EXTENSION));

            // Allowed image types
            $allowedExtensions = ["jpg", "jpeg", "png", "gif"];
            if (!in_array($imgExt, $allowedExtensions)) {
                $response = ["status" => "error", "message" => "Invalid image format"];
                echo json_encode($response);
                exit;
            }

            // Rename image to prevent collisions
            $newImageName = uniqid("IMG_", true) . '.' . $imgExt;
            $uploadDir = "uploads/";

            // Create uploads directory if not exists
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $uploadPath = $uploadDir . $newImageName;

            if (move_uploaded_file($tmpName, $uploadPath)) {
                $imageName = $newImageName;
            } else {
                $response = ["status" => "error", "message" => "Failed to upload image"];
                echo json_encode($response);
                exit;
            }
        }

        // Insert user data into database
        $insertQuery = "INSERT INTO users (unique_id,fname, lname, email, password, img)
                        VALUES ('{$unique_id}','{$fname}', '{$lname}', '{$email}', '{$hashedPassword}', '{$imageName}')";
        $insert = mysqli_query($conn, $insertQuery);

        if ($insert) {
            $response = ["status" => "success", "message" => "User registered successfully"];
        } else {
            $response = ["status" => "error", "message" => "Database insertion failed"];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>
