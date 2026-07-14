<?php
header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$id = isset($_POST['id']) ? $_POST['id'] : '';
$guestName = isset($_POST['guestName']) ? trim($_POST['guestName']) : '';

if (empty($id) || empty($guestName)) {
    echo json_encode(['success' => false, 'error' => 'Missing ID or Guest Name']);
    exit;
}

$file = 'wishlist.json';

if (!file_exists($file)) {
    echo json_encode(['success' => false, 'error' => 'Wishlist file not found']);
    exit;
}

$data = json_decode(file_get_contents($file), true);
$found = false;

foreach ($data as &$item) {
    if ($item['id'] === $id) {
        if ($item['claimed']) {
            echo json_encode(['success' => false, 'error' => 'Gift is already claimed']);
            exit;
        }
        $item['claimed'] = true;
        $item['claimedBy'] = htmlspecialchars($guestName);
        $found = true;
        break;
    }
}

if ($found) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Gift not found']);
}
?>
