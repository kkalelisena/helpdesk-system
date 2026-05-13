import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PastTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // --- ANKET HAFIZALARI ---
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const formatDateTime = (dateString) => {
    if (!dateString) return "Tarih Yok";
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchUserTickets = () => {
    if (loggedInUser && loggedInUser.userId) {
      axios.get(`http://localhost:8081/api/tickets/user/${loggedInUser.userId}`)
        .then(response => setTickets(response.data))
        .catch(error => console.error("Biletler çekilirken hata:", error));
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, []);

  // Bilet değiştiğinde anket sıfırlansın
  useEffect(() => {
    if (selectedTicket) {
      setRating(selectedTicket.rating || 0);
      setFeedback(selectedTicket.feedback || "");
    }
  }, [selectedTicket]);

  // --- ANKETİ GÖNDERME FONKSİYONU ---
  const handleSubmitRating = () => {
    if (rating === 0) {
      alert("Lütfen 1 ile 5 arasında bir yıldız seçin!");
      return;
    }
    axios.put(`http://localhost:8081/api/tickets/${selectedTicket.ticketId}/rate`, {
      rating: rating.toString(),
      feedback: feedback
    })
    .then(response => {
      alert("Değerlendirmeniz için teşekkür ederiz! 🌟");
      setSelectedTicket(response.data); // Ekranı güncelle
      fetchUserTickets(); // Listeyi güncelle
    })
    .catch(error => {
      console.error("Değerlendirme hatası:", error);
      alert("Değerlendirme gönderilemedi.");
    });
  };

  return (
    <div className="container mt-5 mb-5 px-3">
      {selectedTicket ? (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0 fw-bold">Destek Talebi Detayı: #{selectedTicket.ticketId}</h5>
            <button onClick={() => setSelectedTicket(null)} className="btn btn-sm btn-light fw-bold shadow-sm">🔙 Listeye Dön</button>
          </div>
          <div className="card-body p-4 p-md-5">
            
            <div className="row mb-4 bg-light p-3 rounded border">
              <div className="col-md-6 border-end">
                <p className="mb-2 text-muted">Bilet Bilgileri</p>
                <h6 className="fw-bold">{selectedTicket.title}</h6>
                <span className={`badge ${selectedTicket.priority === 'Yüksek' ? 'bg-danger' : 'bg-info text-dark'}`}>{selectedTicket.priority} Öncelik</span>
                <p className="mt-2 mb-0 small text-muted">Açılış: {formatDateTime(selectedTicket.createdAt)}</p>
              </div>
              <div className="col-md-6 ps-md-4">
                <p className="mb-2 text-muted">Mevcut Durum</p>
                <span className={`badge p-2 px-3 fs-6 ${selectedTicket.status === 'Açık' ? 'bg-success' : 'bg-secondary'}`}>
                  {selectedTicket.status === 'Açık' ? '✅ Talebiniz Alındı' : '🏁 Çözüldü / Kapandı'}
                </span>
                <p className="mt-2 mb-0 small text-muted">Kategori: {selectedTicket.category?.categoryName}</p>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-secondary border-bottom pb-2">Sizin Açıklamanız:</h6>
              <div className="p-3 bg-white border rounded shadow-sm text-dark fst-italic">"{selectedTicket.description}"</div>
            </div>

            {selectedTicket.attachmentPath && (
              <div className="mb-4">
                <h6 className="fw-bold text-secondary">Eklediğiniz Görsel:</h6>
                <img src={`http://localhost:8081/uploads/${selectedTicket.attachmentPath}`} alt="ek" className="img-thumbnail" style={{ maxHeight: '120px', cursor: 'pointer' }} onClick={() => setShowImageModal(true)} />
              </div>
            )}

            <div className={`mt-4 p-4 rounded border-start border-5 ${selectedTicket.adminResponse ? 'bg-success bg-opacity-10 border-success' : 'bg-warning bg-opacity-10 border-warning'}`}>
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                {selectedTicket.adminResponse ? '📢 Destek Ekibinin Yanıtı' : '⏳ Henüz Yanıtlanmadı'}
              </h5>
              {selectedTicket.adminResponse ? (
                <div className="fs-5 text-dark" style={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.adminResponse}</div>
              ) : (
                <div className="text-muted fst-italic">Talebiniz uzman ekibimiz tarafından incelenmektedir. Lütfen takipte kalın.</div>
              )}
            </div>

            {/* ==========================================
                YENİ EKLENEN: YILDIZLI DEĞERLENDİRME ALANI 
                ========================================== */}
            {selectedTicket.status === 'Kapalı' && (
              <div className="mt-5 p-4 rounded border border-info bg-light shadow-sm text-center">
                <h5 className="fw-bold mb-3 text-info">🌟 Hizmetimizi Değerlendirin</h5>
                
                {selectedTicket.rating ? (
                  // EĞER ÖNCEDEN PUAN VERİLDİYSE SONUCU GÖSTER
                  <div>
                    <div className="fs-2 mb-2 text-warning" style={{ letterSpacing: '5px' }}>
                      {"★".repeat(selectedTicket.rating)}{"☆".repeat(5 - selectedTicket.rating)}
                    </div>
                    {selectedTicket.feedback && <p className="fst-italic text-muted">"{selectedTicket.feedback}"</p>}
                    <span className="badge bg-success mt-2">Değerlendirmeniz Kaydedildi</span>
                  </div>
                ) : (
                  // EĞER HENÜZ PUAN VERİLMEDİYSE ANKETİ GÖSTER
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className="fs-1 mx-1" 
                          style={{ cursor: 'pointer', color: star <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9', transition: 'color 0.2s' }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea 
                      className="form-control mb-3 w-75 shadow-sm" rows="2" 
                      placeholder="Hizmetimiz hakkında ne düşünüyorsunuz? (İsteğe bağlı)"
                      value={feedback} onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    <button className="btn btn-info text-white fw-bold px-4 rounded-pill shadow" onClick={handleSubmitRating}>
                      Gönder
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      ) : (
        /* STANDART TABLO EKRANI (Aynı Kaldı) */
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">Geçmiş Destek Taleplerim</h2>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary fw-bold shadow-sm">🏠 Panele Dön</button>
          </div>
          <div className="card shadow border-0 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 text-center align-middle">
                  <thead className="table-light border-bottom">
                    <tr><th>ID</th><th>Tarih</th><th className="text-start">Konu</th><th>Durum</th><th>İşlem</th></tr>
                  </thead>
                  <tbody>
                    {tickets.length === 0 ? (
                      <tr><td colSpan="5" className="py-5 text-muted">Henüz destek talebi oluşturmamışsınız.</td></tr>
                    ) : (
                      tickets.map((ticket) => (
                        <tr key={ticket.ticketId}>
                          <td className="fw-bold text-secondary">#{ticket.ticketId}</td>
                          <td className="small text-muted">{formatDateTime(ticket.createdAt)}</td>
                          <td className="text-start fw-bold">{ticket.title}</td>
                          <td><span className={`badge ${ticket.status === 'Açık' ? 'bg-success' : 'bg-secondary'}`}>{ticket.status}</span></td>
                          <td><button className="btn btn-sm btn-primary px-3 fw-bold shadow-sm" onClick={() => setSelectedTicket(ticket)}>Detay / Yanıtı Oku</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {showImageModal && selectedTicket && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={() => setShowImageModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-xl"><div className="modal-content bg-transparent border-0 text-center"><img src={`http://localhost:8081/uploads/${selectedTicket.attachmentPath}`} className="img-fluid rounded" alt="large" /></div></div>
        </div>
      )}
    </div>
  );
}

export default PastTickets;