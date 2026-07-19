<?php
header('Content-Type: application/json');

$secretKey = 'admin123';

if (!isset($_POST['key']) || $_POST['key'] !== $secretKey) {
    echo json_encode(['success' => false, 'error' => 'Неверный ключ']);
    exit;
}

if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'error' => 'Не указан ID сообщения']);
    exit;
}

$id = $_POST['id'];
$file = 'data/messages.json';

if (!file_exists($file)) {
    echo json_encode(['success' => false, 'error' => 'Файл сообщений не найден']);
    exit;
}

$json = file_get_contents($file);
$messages = json_decode($json, true) ?: [];

$found = false;
foreach ($messages as $i => $msg) {
    if ($msg['id'] === $id) {
        if (!empty($msg['media'])) {
            foreach ($msg['media'] as $media) {
                $mediaPath = str_replace('api/', '', $media['url']);
                if (file_exists($mediaPath)) {
                    unlink($mediaPath);
                }
            }
        }
        array_splice($messages, $i, 1);
        $found = true;
        break;
    }
}

if (!$found) {
    echo json_encode(['success' => false, 'error' => 'Сообщение не найдено']);
    exit;
}

if (file_put_contents($file, json_encode($messages, JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка сохранения']);
}
