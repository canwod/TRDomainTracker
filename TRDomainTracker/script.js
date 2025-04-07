// Show loading screen
function showLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

// Hide loading screen
function hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// Update progress bar
function updateProgress(percent) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
}

// Format date for display
function formatDate(date) {
    return date.split('/').reverse().join('/');
}

// Create domain card HTML
function createDomainCard(domain) {
    return `
        <div class="col-md-4 mb-3">
            <div class="card domain-card">
                <div class="card-body">
                    <h5 class="card-title">${domain.name}</h5>
                    <p class="card-text">Başvuru Tarihi: ${domain.date}</p>
                </div>
            </div>
        </div>
    `;
}

let currentPage = 1;
let domains = [];
let existingDomains = new Set();

// Arama formunu dinle
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim();
    fetchData(searchTerm);
});

// Filtreleri sıfırla butonunu dinle
document.getElementById('resetFilters').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    document.getElementById('extensionFilter').value = '';
    document.getElementById('statusFilter').value = '';
    fetchData();
});

// Uzantı filtresini dinle
document.getElementById('extensionFilter').addEventListener('change', function() {
    filterDomains();
});

// Durum filtresini dinle
document.getElementById('statusFilter').addEventListener('change', function() {
    filterDomains();
});

// Daha fazla yükle butonunu dinle
document.getElementById('loadMore').addEventListener('click', function() {
    loadMorePages();
});

function fetchData(searchTerm = '') {
    fetch(`fetch_data.php?page=1&search=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            
            domains = data.domains || [];
            existingDomains.clear();
            displayDomains();
            updateStats();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Veri çekilirken bir hata oluştu');
        });
}

function loadMorePages() {
    const button = document.getElementById('loadMore');
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Yükleniyor...';
    
    const startPage = currentPage + 1;
    const endPage = startPage + 19;
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    let allDomains = [];
    let errors = [];
    
    const loadPages = async () => {
        for (let page = startPage; page <= endPage; page++) {
            try {
                const response = await fetch(`fetch_data.php?page=${page}&search=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                
                if (data.error) {
                    errors.push(`Sayfa ${page}: ${data.error}`);
                    continue;
                }
                
                if (data.domains && data.domains.length > 0) {
                    allDomains = allDomains.concat(data.domains);
                }
                
                // İlerleme durumunu güncelle
                const progress = ((page - startPage + 1) / 20) * 100;
                button.innerHTML = `<i class="bi bi-hourglass-split"></i> Yükleniyor... %${Math.round(progress)}`;
                
                // Her sayfa arasında 500ms bekle
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                errors.push(`Sayfa ${page}: Bağlantı hatası`);
            }
        }
        
        if (errors.length > 0) {
            alert('Bazı sayfalarda hata oluştu:\n' + errors.join('\n'));
        }
        
        if (allDomains.length > 0) {
            domains = domains.concat(allDomains);
            displayDomains();
            updateStats();
            currentPage = endPage;
        }
        
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-plus-circle"></i> 20 Sayfa Daha Getir';
    };
    
    loadPages();
}

function displayDomains() {
    const container = document.getElementById('domainsContainer');
    container.innerHTML = '';
    
    // Filtreleme kriterlerini al
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const extensionFilter = document.getElementById('extensionFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Domainleri filtrele
    let filteredDomains = domains.filter(domain => {
        // Arama terimini kontrol et
        if (searchTerm && !domain.domainName.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Uzantı filtresini kontrol et
        if (extensionFilter && domain.extension !== extensionFilter) {
            return false;
        }
        
        // Durum filtresini kontrol et
        if (statusFilter && domain.status !== statusFilter) {
            return false;
        }
        
        return true;
    });
    
    // Domainleri öncelik puanına göre sırala
    filteredDomains.sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Her domain için kart oluştur
    filteredDomains.forEach(domain => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        
        // Öncelik durumuna göre sınıf ekle
        let priorityClass = '';
        if (domain.priorityScore >= 1500) {
            priorityClass = 'priority-high';
        } else if (domain.priorityScore >= 1000) {
            priorityClass = 'priority-medium';
        } else {
            priorityClass = 'priority-low';
        }
        
        // SEO metriklerini hesapla
        const totalSEOScore = Object.values(domain.seoMetrics).reduce((a, b) => a + b, 0);
        const seoPercentage = Math.round((totalSEOScore / 400) * 100);
        
        card.innerHTML = `
            <div class="card domain-card ${priorityClass}">
                <div class="card-body">
                    <h5 class="card-title">${domain.domainName}</h5>
                    <p class="card-text">
                        <strong>Başvuru Tarihi:</strong> ${domain.date}<br>
                        <strong>Uzantı:</strong> ${domain.extension}<br>
                        <strong>Durum:</strong> ${domain.status}<br>
                        <strong>Öncelik Puanı:</strong> ${domain.priorityScore}
                    </p>
                    <div class="seo-metrics mt-3">
                        <h6 class="mb-2">SEO Metrikleri</h6>
                        <div class="progress mb-2" style="height: 20px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${seoPercentage}%">
                                SEO Puanı: ${seoPercentage}%
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <small>
                                    <i class="bi bi-rulers"></i> Uzunluk: ${domain.seoMetrics.lengthScore}/100<br>
                                    <i class="bi bi-search"></i> Anahtar Kelime: ${domain.seoMetrics.keywordScore}/100
                                </small>
                            </div>
                            <div class="col-6">
                                <small>
                                    <i class="bi bi-eye"></i> Okunabilirlik: ${domain.seoMetrics.readabilityScore}/100<br>
                                    <i class="bi bi-star"></i> Marka Değeri: ${domain.seoMetrics.brandabilityScore}/100
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="domain-details mt-3">
                        <h6 class="mb-2">Domain Detayları</h6>
                        <ul class="list-unstyled small">
                            <li><i class="bi bi-check-circle-fill text-success"></i> Uzunluk: ${domain.domainName.length} karakter</li>
                            <li><i class="bi bi-check-circle-fill text-success"></i> Uzantı: ${domain.extension}</li>
                            <li><i class="bi bi-check-circle-fill text-success"></i> Durum: ${domain.status}</li>
                            <li><i class="bi bi-check-circle-fill text-success"></i> Başvuru Tarihi: ${domain.date}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'Aktif':
            return 'success';
        case 'Yakında':
            return 'warning';
        case 'Beklemede':
            return 'secondary';
        default:
            return 'primary';
    }
}

function updateStats() {
    const total = domains.length;
    const active = domains.filter(d => d.status === 'Aktif').length;
    const upcoming = domains.filter(d => d.status === 'Yakında').length;
    const pending = domains.filter(d => d.status === 'Beklemede').length;
    
    document.getElementById('totalDomains').textContent = total;
    document.getElementById('activeDomains').textContent = active;
    document.getElementById('upcomingDomains').textContent = upcoming;
    document.getElementById('pendingDomains').textContent = pending;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('tr-TR');
}

// Sayfa yüklendiğinde verileri çek
document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

// Display error message
function displayError(message) {
    const container = document.getElementById('domainsContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i> ${message}
                </div>
            </div>
        `;
    }
}

async function fetchAllPages() {
    try {
        showLoading();
        const fetchAllButton = document.getElementById('fetchAllButton');
        fetchAllButton.disabled = true;
        fetchAllButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Veriler Getiriliyor...';
        
        // Tüm sayfaları getir
        let allDomains = [];
        let currentPage = 1;
        let hasMorePages = true;
        
        while (hasMorePages && currentPage <= 10) {
            const response = await fetch(`fetch_data.php?page=${currentPage}`);
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            if (result.domains && result.domains.length > 0) {
                allDomains = allDomains.concat(result.domains);
                currentPage++;
            } else {
                hasMorePages = false;
            }
        }
        
        // Tüm verileri göster
        displayDomains(allDomains);
        
    } catch (error) {
        displayError('Veriler alınırken bir hata oluştu: ' + error.message);
    } finally {
        hideLoading();
        const fetchAllButton = document.getElementById('fetchAllButton');
        fetchAllButton.disabled = false;
        fetchAllButton.innerHTML = '<i class="bi bi-download"></i> Tüm Sayfaları Getir';
    }
}

// Arama fonksiyonu
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#domainTableBody tr');
    
    rows.forEach(row => {
        const domainName = row.cells[1].textContent.toLowerCase();
        const date = row.cells[0].textContent.toLowerCase();
        
        if (domainName.includes(searchText) || date.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Fetch data from server
function fetchData() {
    showLoading();
    
    fetch('fetch_data.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            if (data.error) {
                displayError(data.error);
            } else if (data.length === 0) {
                displayError('Veri bulunamadı');
            } else {
                displayDomains(data);
            }
        })
        .catch(error => {
            hideLoading();
            displayError(error.message);
        });
}

// Initial data fetch when page loads
document.addEventListener('DOMContentLoaded', fetchData);

async function loadMorePages() {
    try {
        showLoading();
        const loadMoreButton = document.getElementById('loadMore');
        if (!loadMoreButton) {
            throw new Error('Load more button not found');
        }
        
        loadMoreButton.disabled = true;
        loadMoreButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Veriler Getiriliyor...';
        
        // Tüm 50 sayfayı getir
        let allDomains = [];
        let startPage = 1;
        let endPage = 50;
        let errors = [];
        
        for (let page = startPage; page <= endPage; page++) {
            try {
                const response = await fetch(`fetch_data.php?page=${page}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                
                if (result.error) {
                    errors.push(`Sayfa ${page}: ${result.error}`);
                    continue;
                }
                
                if (result.domains && result.domains.length > 0) {
                    // Yeni domain'leri filtrele ve ekle
                    const newDomains = result.domains.filter(domain => !existingDomains.has(domain.domainName));
                    allDomains = allDomains.concat(newDomains);
                    
                    // Yeni domain'leri set'e ekle
                    newDomains.forEach(domain => existingDomains.add(domain.domainName));
                }
                
                // İlerleme durumunu göster
                const progress = Math.round(((page - startPage + 1) / 50) * 100);
                updateProgress(progress);
                loadMoreButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Veriler Getiriliyor... (${progress}%)`;
                
                // Her sayfa arasında kısa bir bekleme
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                errors.push(`Sayfa ${page}: ${error.message}`);
            }
        }
        
        if (errors.length > 0) {
            displayError('Bazı sayfalarda hata oluştu:\n' + errors.join('\n'));
        }
        
        if (allDomains.length > 0) {
            domains = allDomains;
            displayDomains();
            updateStats();
        }
        
    } catch (error) {
        displayError('Veriler alınırken bir hata oluştu: ' + error.message);
    } finally {
        hideLoading();
        const loadMoreButton = document.getElementById('loadMore');
        if (loadMoreButton) {
            loadMoreButton.disabled = false;
            loadMoreButton.innerHTML = '<i class="bi bi-plus-circle"></i> Verileri Getir';
        }
    }
} 