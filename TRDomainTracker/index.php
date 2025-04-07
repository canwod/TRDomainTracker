<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TRABIS Domain Takip Sistemi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .domain-card {
            transition: transform 0.2s;
        }
        .domain-card:hover {
            transform: translateY(-5px);
        }
        .priority-high {
            border-left: 4px solid #dc3545;
        }
        .priority-medium {
            border-left: 4px solid #ffc107;
        }
        .priority-low {
            border-left: 4px solid #28a745;
        }
        .stats-card {
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
        }
    </style>
</head>
<body>
    <div class="container py-4">
        <!-- Loading Screen -->
        <div id="loadingScreen" class="loading-screen" style="display: none;">
            <div class="loading-content">
                <div class="loading-icon">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
                <div class="loading-text">
                    <h2 class="loading-title">Veriler Getiriliyor</h2>
                    <p class="loading-subtitle">Lütfen bekleyin...</p>
                    <div class="loading-progress">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h1 class="text-center mb-4">TRABIS Domain Takip Sistemi</h1>
        
        <!-- Arama ve Filtreler -->
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <form id="searchForm" class="row g-3">
                            <div class="col-md-4">
                                <input type="text" class="form-control" id="searchInput" placeholder="Domain ara...">
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" id="extensionFilter">
                                    <option value="">Tüm Uzantılar</option>
                                    <option value=".com.tr">.com.tr</option>
                                    <option value=".net.tr">.net.tr</option>
                                    <option value=".org.tr">.org.tr</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" id="statusFilter">
                                    <option value="">Tüm Durumlar</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Yakında">Yakında</option>
                                    <option value="Beklemede">Beklemede</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <button type="button" id="resetFilters" class="btn btn-outline-secondary w-100">
                                    <i class="bi bi-arrow-counterclockwise"></i> Sıfırla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- İstatistikler -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body">
                        <h5 class="card-title">Toplam Domain</h5>
                        <p class="card-text display-4" id="totalDomains">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body">
                        <h5 class="card-title">Aktif Domain</h5>
                        <p class="card-text display-4" id="activeDomains">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body">
                        <h5 class="card-title">Yakında</h5>
                        <p class="card-text display-4" id="upcomingDomains">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body">
                        <h5 class="card-title">Beklemede</h5>
                        <p class="card-text display-4" id="pendingDomains">0</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Domain Listesi -->
        <div class="row">
            <div class="col-md-12">
                <div id="domainsContainer" class="row"></div>
            </div>
        </div>
        
        <!-- Daha Fazla Yükle Butonu -->
        <div class="row mt-4">
            <div class="col-md-12 text-center">
                <button id="loadMore" class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Verileri Getir
                </button>
            </div>
        </div>
        
        <!-- Son Güncelleme -->
        <div class="row mt-4">
            <div class="col-md-12 text-center">
                <small class="text-muted">Son Güncelleme: <span id="lastUpdate">-</span></small>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html> 