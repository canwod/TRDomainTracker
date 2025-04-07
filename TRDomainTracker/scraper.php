<?php

function scrapeTrabisDomains($page) {
    $url = "https://www.trabis.gov.tr/yenidenTahsiseAcilanAlanAdlari?page={$page}&perPage=100&domain=";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    $html = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    $dom = new DOMDocument();
    @$dom->loadHTML($html);
    $xpath = new DOMXPath($dom);
    
    $domains = [];
    $rows = $xpath->query('//table//tr[position() > 1]'); // Skip header row
    
    foreach ($rows as $row) {
        $cells = $row->getElementsByTagName('td');
        if ($cells->length >= 3) {
            $domainName = trim($cells->item(1)->textContent);
            $date = trim($cells->item(2)->textContent);
            
            // Extract domain extension
            $extension = '';
            if (preg_match('/\.(com\.tr|net\.tr|org\.tr|web\.tr)$/', $domainName, $matches)) {
                $extension = $matches[1];
            }
            
            // Calculate SEO metrics
            $seoMetrics = calculateSEOMetrics($domainName);
            
            // Calculate priority score based on domain length, extension and SEO metrics
            $priorityScore = calculatePriorityScore($domainName, $extension, $seoMetrics);
            
            $domains[] = [
                'domainName' => $domainName,
                'date' => $date,
                'extension' => $extension,
                'priorityScore' => $priorityScore,
                'status' => 'Yakında',
                'seoMetrics' => $seoMetrics
            ];
        }
    }
    
    return $domains;
}

function calculateSEOMetrics($domainName) {
    $metrics = [
        'lengthScore' => 0,
        'keywordScore' => 0,
        'readabilityScore' => 0,
        'brandabilityScore' => 0
    ];
    
    // Remove extension for calculations
    $name = preg_replace('/\.(com\.tr|net\.tr|org\.tr|web\.tr)$/', '', $domainName);
    
    // Length score (shorter is better)
    $length = strlen($name);
    $metrics['lengthScore'] = max(0, 100 - ($length * 2));
    
    // Keyword score (check for common keywords)
    $keywords = ['market', 'shop', 'store', 'tech', 'digital', 'web', 'online', 'turkey', 'türkiye', 'istanbul', 'ankara', 'izmir'];
    $keywordCount = 0;
    foreach ($keywords as $keyword) {
        if (stripos($name, $keyword) !== false) {
            $keywordCount++;
        }
    }
    $metrics['keywordScore'] = $keywordCount * 20;
    
    // Readability score (check for hyphens and numbers)
    $hyphenCount = substr_count($name, '-');
    $numberCount = preg_match_all('/[0-9]/', $name);
    $metrics['readabilityScore'] = 100 - (($hyphenCount + $numberCount) * 20);
    
    // Brandability score (check for memorable patterns)
    $metrics['brandabilityScore'] = calculateBrandabilityScore($name);
    
    return $metrics;
}

function calculateBrandabilityScore($name) {
    $score = 0;
    
    // Check for repeated letters
    if (preg_match('/(.)\1{2,}/', $name)) {
        $score -= 20;
    }
    
    // Check for consonant-vowel patterns
    if (preg_match('/^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz][aeiou]/i', $name)) {
        $score += 30;
    }
    
    // Check for common brand patterns
    if (preg_match('/^(?:[a-z]{2,})(?:[0-9]{1,2})?$/i', $name)) {
        $score += 40;
    }
    
    return max(0, min(100, $score));
}

function calculatePriorityScore($domainName, $extension, $seoMetrics) {
    $score = 0;
    
    // Base score based on extension
    switch ($extension) {
        case 'com.tr':
            $score += 1000;
            break;
        case 'net.tr':
            $score += 800;
            break;
        case 'org.tr':
            $score += 600;
            break;
        case 'web.tr':
            $score += 400;
            break;
    }
    
    // Add SEO metrics to score
    $score += $seoMetrics['lengthScore'];
    $score += $seoMetrics['keywordScore'];
    $score += $seoMetrics['readabilityScore'];
    $score += $seoMetrics['brandabilityScore'];
    
    return $score;
}

function determineStatus($applicationDate) {
    $appDate = DateTime::createFromFormat('d.m.Y', $applicationDate);
    $now = new DateTime();
    $diff = $now->diff($appDate);
    $days = $diff->days;
    
    if ($days <= 0) {
        return 'Aktif';
    } elseif ($days <= 7) {
        return 'Yakında';
    } else {
        return 'Beklemede';
    }
}

function calculateDaysUntilApp($applicationDate) {
    $appDate = DateTime::createFromFormat('d.m.Y', $applicationDate);
    $now = new DateTime();
    $diff = $now->diff($appDate);
    return $diff->days;
} 