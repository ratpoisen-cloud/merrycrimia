<?php
header('Content-Type: application/json');

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Имя и сообщение обязательны']);
    exit;
}

$uploadedMedia = [];
$uploadDir = 'uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (isset($_FILES['guestMedia'])) {
    $totalFiles = count($_FILES['guestMedia']['name']);
    for ($i = 0; $i < $totalFiles; $i++) {
        if ($_FILES['guestMedia']['error'][$i] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['guestMedia']['tmp_name'][$i];
            $originalName = basename($_FILES['guestMedia']['name'][$i]);
            $fileType = mime_content_type($tmpName);
            
            // Check if image or video
            $type = '';
            if (strpos($fileType, 'image/') === 0) {
                $type = 'image';
            } elseif (strpos($fileType, 'video/') === 0) {
                $type = 'video';
            } else {
                continue; // Skip invalid files
            }
            
            $ext = pathinfo($originalName, PATHINFO_EXTENSION);
            $newName = uniqid('media_', true) . '.' . $ext;
            $dest = $uploadDir . $newName;
            
            if (move_uploaded_file($tmpName, $dest)) {
                $uploadedMedia[] = [
                    'type' => $type,
                    'url' => 'api/' . $dest
                ];
            }
        }
    }
}

$entry = [
    'id' => uniqid(),
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'text' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
    'media' => $uploadedMedia,
    'timestamp' => time()
];

$file = 'data/messages.json';
if (!is_dir('data')) {
    mkdir('data', 0777, true);
}

$messages = [];
if (file_exists($file)) {
    $json = file_get_contents($file);
    $messages = json_decode($json, true) ?: [];
}

$messages[] = $entry;

if (file_put_contents($file, json_encode($messages, JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Не удалось сохранить сообщение']);
}
