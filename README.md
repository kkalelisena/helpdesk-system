# 🎫 Müşteri Destek ve Bilet Takip Sistemi (Helpdesk Management)

Bu proje, kurumsal ihtiyaçlara yönelik geliştirilmiş, kullanıcıların destek talepleri (bilet) oluşturabildiği, yöneticilerin ise bu talepleri filtreleyip yanıtlayabildiği tam yığın (full-stack) bir yönetim sistemidir.

## ✨ Öne Çıkan Özellikler

* **Rol Tabanlı Yetkilendirme:** Admin ve Müşteri rolleri için özelleştirilmiş dashboard ve yetki kontrolleri.
* **Akıllı Bilet Yönetimi:** Taleplerin durum (Açık/Kapalı) ve öncelik (Düşük, Orta, Yüksek) seviyelerine göre dinamik filtrelenmesi.
* **Otomatik E-posta Bildirimleri (SMTP):** Şifre sıfırlama işlemleri ve bilet yanıtlarında kullanıcılara JavaMailSender ile otomatik e-posta gönderimi.
* **Müşteri Memnuniyet Analizi (CSAT):** Çözülen biletlerin ardından müşterilerin hizmeti 5 yıldız üzerinden değerlendirebildiği interaktif feedback sistemi.
* **Gelişmiş Güvenlik ve UI:** Gerçek zamanlı şifre gücü analizi, responsive (mobil uyumlu) modern arayüz ve kullanıcı dostu navigasyon modeli.

## 🛠️ Teknik Stack

* **Frontend:** React.js, Bootstrap 5, Axios, React Router
* **Backend:** Java 17, Spring Boot 3, Spring Data JPA
* **Veritabanı:** MySQL (İlişkisel veritabanı mimarisi ve Foreign Key yönetimi)
* **İletişim:** RESTful API ve SMTP Protokolü

## 📊 Veritabanı Mimarisi

Sistemin temelini oluşturan varlıklar arasındaki ilişkiler (ER Diyagramı) aşağıdaki yapı üzerine kurulmuştur:



## 🚀 Kurulum ve Çalıştırma

### Arka Yüz (Backend)
1. `src/main/resources/application.properties` dosyasındaki MySQL kullanıcı adı ve şifrenizi güncelleyin.
2. Projeyi Maven ile derleyin ve çalıştırın.

### Ön Yüz (Frontend)
1. Terminalde `npm install` komutu ile bağımlılıkları yükleyin.
2. `npm start` ile uygulamayı ayağa kaldırın.

---

