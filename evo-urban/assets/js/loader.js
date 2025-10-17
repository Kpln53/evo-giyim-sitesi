// GÜNCELLENMİŞ loader.js DOSYASI

document.addEventListener("DOMContentLoaded", function() {
    
    const headerPromise = fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    const footerPromise = fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Her iki yükleme işlemi de bittikten sonra...
    Promise.all([headerPromise, footerPromise])
        .then(() => {
            // ...main.js'teki fonksiyonları başlat!
            initializeMainScripts(); 
        })
        .catch(error => console.error('Bileşenler yüklenirken hata oluştu:', error));
});