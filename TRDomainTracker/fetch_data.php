<?php
header('Content-Type: application/json');

require_once 'scraper.php';

try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    if ($page < 1) {
        throw new Exception('Geçersiz sayfa numarası');
    }
    
    $domains = scrapeTrabisDomains($page);
    
    // Arama terimi varsa filtrele
    if (!empty($searchTerm)) {
        $domains = array_filter($domains, function($domain) use ($searchTerm) {
            return stripos($domain['domainName'], $searchTerm) !== false;
        });
    }
    
    // Domainleri öncelik puanına göre sırala
    usort($domains, function($a, $b) {
        return $b['priorityScore'] - $a['priorityScore'];
    });
    
    echo json_encode([
        'success' => true,
        'domains' => array_values($domains),
        'page' => $page,
        'total' => count($domains)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} 