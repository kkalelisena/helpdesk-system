import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [adminReply, setAdminReply] = useState("");

  // ==========================================
  // HAFIZALAR: FİLTRELEME VE SIRALAMA
  // ==========================================
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [filterPriority, setFilterPriority] = useState("Tümü");
  const [filterStatus, setFilterStatus] = useState("Tümü"); // YENİ: Durum filtresi
  const [sortOrder, setSortOrder] = useState("newest"); 

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const adminName = loggedInUser ? loggedInUser.fullName : "Yönetici";

  const fetchAllTickets = () => {
    axios.get('http://localhost:8081/api/tickets/all')
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => console.error("Biletleri çekerken hata:", error));
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Tarih Yok";
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSendReply = () => {
    if (!adminReply.trim()) {
      alert("Lütfen müşteriye iletilecek bir yanıt yazın!");
      return;
    }

    axios.put(`http://localhost:8081/api/tickets/${selectedTicket.ticketId}/reply`, {
      adminResponse: adminReply
    })
    .then(response => {
      alert("Yanıt başarıyla gönderildi ve bilet kapatıldı!");
      setAdminReply(""); 
      setSelectedTicket(null); 
      fetchAllTickets(); 
    })
    .catch(error => {
      console.error("Yanıt gönderme hatası:", error);
      alert("Yanıt iletilemedi. Sunucu hatası!");
    });
  };

  // ==========================================
  // FİLTRELEME VE SIRALAMA MOTORU (GÜNCELLENDİ)
  // ==========================================
  const getFilteredAndSortedTickets = () => {
    let result = [...tickets];

    // 1. Kategoriye Göre Filtrele
    if (filterCategory !== "Tümü") {
      result = result.filter(t => t.category && t.category.categoryName === filterCategory);
    }

    // 2. Önceliğe Göre Filtrele
    if (filterPriority !== "Tümü") {
      result = result.filter(t => t.priority === filterPriority);
    }

    // 3. Duruma Göre Filtrele (YENİ EKLENDİ)
    if (filterStatus !== "Tümü") {
      result = result.filter(t => t.status === filterStatus);
    }

    // 4. Tarihe Göre Sırala
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0); 
      const dateB = new Date(b.createdAt || 0);
      
      if (sortOrder === "newest") {
        return dateB - dateA; 
      } else {
        return dateA - dateB; 
      }
    });

    return result;
  };

  const filteredTickets = getFilteredAndSortedTickets();

  return (
    <div className="container-fluid mt-4 px-4 mb-5">
      
      <nav className="navbar navbar-dark bg-dark shadow-sm rounded mb-4 px-4 py-3 d-flex justify-content-between align-items-center">
        <span className="navbar-brand mb-0 h4 fw-bold text-warning">🛠️ Sistem Yönetim Paneli</span>
        <div className="d-flex align-items-center">
          <span className="me-4 text-light fw-bold d-none d-md-block">Yetkili: {adminName}</span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm fw-bold px-3">ÇIKIŞ YAP</button>
        </div>
      </nav>

      <div className="row">
        <div className="col-12">
          
          {selectedTicket ? (
            /* --- BİLET DETAY EKRANI --- */
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 fw-bold">Bilet İncelemesi: #{selectedTicket.ticketId}</h5>
                <button onClick={() => setSelectedTicket(null)} className="btn btn-sm btn-light fw-bold shadow-sm">🔙 Listeye Dön</button>
              </div>
              <div className="card-body p-5">
                
                <div className="row mb-4 bg-light p-3 rounded border">
                  <div className="col-md-6">
                    <p className="mb-2"><strong>👤 Müşteri:</strong> <span className="text-primary fw-bold">{selectedTicket.user?.fullName}</span></p>
                    <p className="mb-2"><strong>📁 Kategori:</strong> {selectedTicket.category?.categoryName}</p>
                    <p className="mb-0"><strong>📌 Durum:</strong> <span className={`badge ${selectedTicket.status === 'Açık' ? 'bg-success' : 'bg-secondary'}`}>{selectedTicket.status}</span></p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2"><strong>📝 Konu:</strong> {selectedTicket.title}</p>
                    <p className="mb-2"><strong>🚨 Öncelik:</strong> <span className={`badge ${selectedTicket.priority === 'Yüksek' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedTicket.priority}</span></p>
                    <p className="mb-0"><strong>🕒 Açılış Tarihi:</strong> {formatDateTime(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <h6 className="fw-bold border-bottom pb-2 text-secondary">Müşterinin Açıklaması:</h6>
                  <div className="p-4 bg-white border rounded shadow-sm fs-5">{selectedTicket.description}</div>
                </div>

                {selectedTicket.attachmentPath && (
                  <div className="mb-5">
                    <h6 className="fw-bold border-bottom pb-2 text-secondary">📎 Ekli Dosya:</h6>
                    <img 
                      src={`http://localhost:8081/uploads/${selectedTicket.attachmentPath}`} 
                      className="img-thumbnail" style={{ maxHeight: '150px', cursor: 'pointer' }}
                      onClick={() => setShowImageModal(true)}
                      alt="attachment"
                    />
                  </div>
                )}

                <div className="mt-5 border-top pt-4">

                   <h5 className="fw-bold mb-3 text-success">💬 Müşteriye Yanıt Gönder</h5>
                   {/* ==========================================
                    YENİ EKLENEN: MÜŞTERİNİN VERDİĞİ PUAN
                    ========================================== */}
                {selectedTicket.status === 'Kapalı' && selectedTicket.rating > 0 && (
                  <div className="mt-4 p-4 rounded bg-warning bg-opacity-10 border border-warning text-center">
                    <h5 className="fw-bold text-dark mb-2">🌟 Müşteri Memnuniyet Anketi Sonucu</h5>
                    <div className="fs-2 text-warning mb-2" style={{ letterSpacing: '5px' }}>
                      {"★".repeat(selectedTicket.rating)}{"☆".repeat(5 - selectedTicket.rating)}
                    </div>
                    <span className="badge bg-dark mb-3">Puan: {selectedTicket.rating} / 5</span>
                    
                    {selectedTicket.feedback && (
                      <div className="p-3 bg-white border rounded fst-italic text-secondary shadow-sm text-start">
                        "{selectedTicket.feedback}"
                      </div>
                    )}
                  </div>
                )}
                  <textarea 
                    className="form-control shadow-sm mb-3" 
                    rows="4" 
                    placeholder="Müşteriye iletilecek çözüm mesajını buraya yazın..."
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                  ></textarea>
                  <button className="btn btn-success fw-bold px-4 py-2 shadow-sm" onClick={handleSendReply}>
                    Yanıtı İlet ve Bileti Kapat
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* --- TABLO VE FİLTRE EKRANI --- */
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold text-dark">Sisteme Düşen Talepler</h5>
              </div>
              
              <div className="bg-light p-3 border-bottom d-flex flex-wrap gap-3 align-items-center">
                
                <div className="d-flex align-items-center">
                  <span className="fw-bold text-secondary me-2">📁 Kategori:</span>
                  <select className="form-select form-select-sm w-auto shadow-sm fw-bold border-primary" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="Tümü">Tümü</option>
                    <option value="Donanım">Donanım</option>
                    <option value="Yazılım">Yazılım</option>
                    <option value="Ağ & İnternet">Ağ & İnternet</option>
                  </select>
                </div>

                <div className="d-flex align-items-center ms-md-3">
                  <span className="fw-bold text-secondary me-2">🚨 Öncelik:</span>
                  <select className="form-select form-select-sm w-auto shadow-sm fw-bold border-primary" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="Tümü">Tümü</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </div>

                {/* ==========================================
                    YENİ EKLENEN: DURUM FİLTRESİ
                    ========================================== */}
                <div className="d-flex align-items-center ms-md-3">
                  <span className="fw-bold text-secondary me-2">📌 Durum:</span>
                  <select className="form-select form-select-sm w-auto shadow-sm fw-bold border-primary" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="Tümü">Tümü</option>
                    <option value="Açık">Açık</option>
                    <option value="Kapalı">Kapalı</option>
                  </select>
                </div>

                <div className="d-flex align-items-center ms-md-auto">
                  <span className="fw-bold text-secondary me-2">📅 Sırala:</span>
                  <select className="form-select form-select-sm w-auto shadow-sm fw-bold border-dark bg-dark text-white" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">En Yeni İlk Sırada</option>
                    <option value="oldest">En Eski İlk Sırada</option>
                  </select>
                </div>
                
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover text-center align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th><th>Müşteri</th><th>Tarih</th><th>Kategori</th><th>Öncelik</th><th>Durum</th><th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.length === 0 ? (
                        <tr><td colSpan="7" className="py-5 text-muted fw-bold">Bu filtrelere uygun bilet bulunamadı. 🕵️‍♂️</td></tr>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <tr key={ticket.ticketId}>
                            <td className="fw-bold text-secondary">#{ticket.ticketId}</td>
                            <td className="fw-bold text-primary">{ticket.user?.fullName}</td>
                            <td className="text-muted" style={{ fontSize: '0.9rem' }}>{formatDateTime(ticket.createdAt)}</td>
                            <td>{ticket.category?.categoryName}</td>
                            <td><span className={`badge ${ticket.priority === 'Yüksek' ? 'bg-danger' : ticket.priority === 'Orta' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{ticket.priority}</span></td>
                            <td><span className={`badge ${ticket.status === 'Açık' ? 'bg-success' : 'bg-secondary'}`}>{ticket.status}</span></td>
                            <td><button className="btn btn-sm btn-primary fw-bold" onClick={() => setSelectedTicket(ticket)}>İncele / Yanıtla</button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showImageModal && selectedTicket && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={() => setShowImageModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-xl" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0 text-center">
              <img src={`http://localhost:8081/uploads/${selectedTicket.attachmentPath}`} className="img-fluid rounded" style={{ maxHeight: '90vh' }} alt="large" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;