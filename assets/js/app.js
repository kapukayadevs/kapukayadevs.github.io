// Modal fonksiyonlarını global scope'a taşıyalım
function openModal(imgSrc) {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.getElementById('modalImage');
    modal.classList.add('active');
    modalImg.src = imgSrc;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi'); // Debug için

    const hamburger = document.querySelector('.hamburger');
    const mobileClose = document.querySelector('.mobile-close');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    const body = document.body;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileClose.classList.toggle('active');
        navLinks.classList.toggle('active');
        authButtons.classList.toggle('active');
        body.classList.toggle('menu-active');
    }

    // Hamburger menü tıklama
    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    // Kapatma butonu tıklama
    if (mobileClose) mobileClose.addEventListener('click', toggleMenu);

    // Sayfa dışına tıklandığında menüyü kapat
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickInsideAuth = authButtons.contains(event.target);
        const isClickInsideHamburger = hamburger.contains(event.target);
        const isClickInsideClose = mobileClose.contains(event.target);

        if (!isClickInsideNav && !isClickInsideAuth && !isClickInsideHamburger && !isClickInsideClose) {
            hamburger.classList.remove('active');
            mobileClose.classList.remove('active');
            navLinks.classList.remove('active');
            authButtons.classList.remove('active');
            body.classList.remove('menu-active');
        }
    });

    // Market kategori filtreleme
    const categoryButtons = document.querySelectorAll('.category-btn');
    const shopItems = document.querySelectorAll('.shop-item');

    // Sayfa yüklendiğinde tüm ürünleri göster
    shopItems.forEach(item => item.classList.add('active'));

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif buton sınıfını güncelle
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Seçilen kategoriyi al
            const selectedCategory = button.getAttribute('data-category');
            
            // Ürünleri filtrele
            shopItems.forEach(item => {
                if (selectedCategory === 'all') {
                    item.classList.add('active');
                } else {
                    if (item.getAttribute('data-category') === selectedCategory) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                }
            });
        });
    });

    const kurOrani = 0.10; // Birim fiyatı en üste taşıyoruz

    // Dönüşüm hesaplayıcı
    const coinInput = document.querySelector('.conversion-input input[type="number"]');
    const tlOutput = document.querySelector('.conversion-input input[readonly]');

    if (coinInput && tlOutput) {
        coinInput.addEventListener('input', function() {
            let coinMiktar = parseFloat(this.value) || 0;
            
            // Minimum işlem kontrolü
            if (coinMiktar < 100) {
                tlOutput.value = "0.00";
                return;
            }

            // TL değerini hesapla ve göster
            const tlMiktar = (coinMiktar * kurOrani).toFixed(2);
            tlOutput.value = tlMiktar;
        });
    }

    // Market sayfası işlemleri
    const shopPage = document.querySelector('.shop-list');
    console.log('Shop page:', shopPage); // Debug için

    if (shopPage) {
        const buyButtons = document.querySelectorAll('.buy-btn');
        console.log('Bulunan satın al butonları:', buyButtons.length); // Debug için

        const popup = document.querySelector('.trade-popup');
        const popupClose = document.querySelector('.popup-close');
        const popupCancel = document.querySelector('.popup-cancel');
        const popupConfirm = document.querySelector('.popup-confirm');
        const popupInput = document.querySelector('.popup-input');
        const popupTotal = document.querySelector('.popup-total span');

        // Satın alma işlemleri
        buyButtons.forEach(button => {
            button.onclick = async function(e) {
                e.preventDefault();
                const shopItem = this.closest('.shop-item');
                if (shopItem) {
                    const priceElement = shopItem.querySelector('.item-price span');
                    if (priceElement) {
                        const price = priceElement.textContent;
                        openShopPopup(price);
                    }
                }
            };
        });

        // Popup açma fonksiyonu
        function openShopPopup(price) {
            console.log('Popup açılıyor, fiyat:', price); // Debug için
            if (!popup) {
                console.error('Popup elementi bulunamadı!');
                return;
            }
            popup.style.display = 'flex';
            if (popupInput) {
                popupInput.value = '';
                popupInput.dataset.price = price;
            }
            if (popupTotal) popupTotal.textContent = '0';
        }

        // Popup kapatma fonksiyonu
        function closeShopPopup() {
            if (!popup) return;
            popup.style.display = 'none';
        }

        // Miktar değiştiğinde toplam fiyatı güncelle
        if (popupInput) {
            popupInput.addEventListener('input', function() {
                const miktar = parseInt(this.value) || 0;
                const birimFiyat = parseInt(this.dataset.price) || 0;
                if (popupTotal) popupTotal.textContent = (miktar * birimFiyat).toString();
            });
        }

        // Popup kapatma butonları
        if (popupClose) popupClose.addEventListener('click', closeShopPopup);
        if (popupCancel) popupCancel.addEventListener('click', closeShopPopup);

        // Satın alma onayı
        if (popupConfirm) {
            popupConfirm.addEventListener('click', async function() {
                const miktar = parseInt(popupInput ? popupInput.value : 0);
                if (miktar > 0) {
                    try {
                        // Backend'e istek atacak şekilde düzenlendi
                        const response = await fetch('/api/shop/purchase', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                amount: miktar,
                                price: parseInt(popupInput.dataset.price)
                            })
                        });

                        if (response.ok) {
                            const result = await response.json();
                            alert('Satın alma işlemi başarılı!');
                            closeShopPopup();
                            // Sayfayı yenile veya bakiyeyi güncelle
                            location.reload();
                        } else {
                            alert('Satın alma işlemi başarısız: ' + (await response.text()));
                        }
                    } catch (error) {
                        alert('Bir hata oluştu: ' + error.message);
                    }
                } else {
                    alert('Lütfen geçerli bir miktar giriniz.');
                }
            });
        }

        // Popup dışına tıklandığında kapat
        if (popup) {
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    closeShopPopup();
                }
            });
        }
    }

    // Borsa sayfası işlemleri
    const exchangePage = document.querySelector('.market-section');
    if (exchangePage) {
        const buyButton = document.querySelector('.buy-btn');
        const sellButton = document.querySelector('.sell-btn');
        const tradePopup = document.querySelector('.trade-popup');
        const popupClose = document.querySelector('.popup-close');
        const popupCancel = document.querySelector('.popup-cancel');
        const popupConfirm = document.querySelector('.popup-confirm');
        const popupInput = document.querySelector('.popup-input');
        const popupTotal = document.querySelector('.popup-total span');
        const popupTitle = document.querySelector('.popup-title');
        let currentTradeType = '';

        // Borsa için popup açma
        function openTradePopup(type) {
            if (!tradePopup) return;
            currentTradeType = type;
            tradePopup.style.display = 'flex';
            if (popupTitle) {
                popupTitle.textContent = type === 'buy' ? 'Coin Satın Al' : 'Coin Sat';
            }
            if (popupInput) {
                popupInput.value = '';
            }
            if (popupTotal) {
                popupTotal.textContent = '0.00';
            }
        }

        // Borsa için popup kapatma
        function closeTradePopup() {
            if (!tradePopup) return;
            tradePopup.style.display = 'none';
        }

        // Borsa için toplam hesaplama
        function calculateTradeTotal() {
            if (!popupInput || !popupTotal) return;
            const amount = parseFloat(popupInput.value) || 0;
            const rate = 0.10; // Coin birim fiyatı
            popupTotal.textContent = (amount * rate).toFixed(2);
        }

        if (buyButton) {
            buyButton.addEventListener('click', () => openTradePopup('buy'));
        }
        
        if (sellButton) {
            sellButton.addEventListener('click', () => openTradePopup('sell'));
        }

        if (popupInput) {
            popupInput.addEventListener('input', calculateTradeTotal);
        }

        // Borsa popup event listener'ları
        if (popupClose) {
            popupClose.addEventListener('click', closeTradePopup);
        }

        if (popupCancel) {
            popupCancel.addEventListener('click', closeTradePopup);
        }

        if (popupConfirm) {
            popupConfirm.addEventListener('click', async () => {
                try {
                    const amount = parseFloat(popupInput.value) || 0;
                    if (amount <= 0) {
                        alert('Lütfen geçerli bir miktar giriniz.');
                        return;
                    }

                    // Backend'e istek atacak şekilde düzenlendi
                    const response = await fetch(`/api/exchange/${currentTradeType}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            amount: amount
                        })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert(`${currentTradeType === 'buy' ? 'Alım' : 'Satım'} işlemi başarılı!`);
                        closeTradePopup();
                        // Sayfayı yenile veya bakiyeyi güncelle
                        location.reload();
                    } else {
                        alert('İşlem başarısız: ' + (await response.text()));
                    }
                } catch (error) {
                    alert('Bir hata oluştu: ' + error.message);
                }
            });
        }

        // Popup dışına tıklandığında kapatma
        if (tradePopup) {
            tradePopup.addEventListener('click', (e) => {
                if (e.target === tradePopup) {
                    closeTradePopup();
                }
            });
        }
    }

    // Profil sekme değiştirme
    const profileTabs = document.querySelectorAll('.profile-tabs .tab-btn');
    const profileContents = document.querySelectorAll('.profile-content');

    if (profileTabs.length > 0 && profileContents.length > 0) {
        // Sayfa yüklendiğinde tüm içerikleri gizle ve ilk sekmeyi göster
        profileContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // İlk sekmeyi ve içeriğini aktif yap
        const firstTab = profileTabs[0];
        const firstContent = document.querySelector('.profile-content[data-category="stats"]');
        if (firstTab && firstContent) {
            firstTab.classList.add('active');
            firstContent.classList.add('active');
        }

        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Aktif buton sınıfını güncelle
                profileTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Seçilen kategoriyi al
                const selectedCategory = tab.getAttribute('data-category');
                
                // İçerikleri filtrele
                profileContents.forEach(content => {
                    if (content.getAttribute('data-category') === selectedCategory) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Lazy Loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Event Delegation
    document.addEventListener('click', function(e) {
        // Modal açma işlemi için delegation
        if (e.target.matches('.gallery-grid img')) {
            openModal(e.target.src);
        }
    });

    // Debounce fonksiyonu
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Scroll event optimizasyonu
    const scrollHandler = debounce(() => {
        // Scroll işlemleri
    }, 150);

    window.addEventListener('scroll', scrollHandler);

    // Modal işlemleri için performans iyileştirmesi
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.matches('.modal-close')) {
                closeModal();
            }
        });

        // ESC tuşu için event listener
        const escHandler = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        function openModal(imgSrc) {
            const modalImg = document.getElementById('modalImage');
            modal.classList.add('active');
            modalImg.src = imgSrc;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', escHandler);
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        }

        window.openModal = openModal;
        window.closeModal = closeModal;
    }
}); 