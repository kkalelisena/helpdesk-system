import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const userName = loggedInUser ? loggedInUser.fullName : "Misafir";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Düşük');
  const [categoryId, setCategoryId] = useState('1'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [attachment, setAttachment] = useState(null);    

  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (loggedInUser && loggedInUser.userId) {
      axios.get(`http://localhost:8081/api/tickets/user/${loggedInUser.userId}`)
        .then(response => {
          const unreadTickets = response.data.some(ticket => ticket.status === 'Kapalı' && (!ticket.rating || ticket.rating === 0));
          setHasNotification(unreadTickets);
        })
        .catch(error => console.error("Bildirimler kontrol edilemedi:", error));
    }
  }, [loggedInUser]);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Düşük');
    setAttachment(null);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault(); 
    
    if (!title || !description) {
      alert("Lütfen başlık ve açıklama kısımlarını doldurun!");
      return;
    }

    const newTicket = {
      title: title,
      description: description,
      status: "Açık", 
      priority: priority,
      user: { userId: loggedInUser.userId }, 
      category: { categoryId: parseInt(categoryId) } 
    };

    axios.post('http://localhost:8081/api/tickets', newTicket)
      .then(response => {
        const createdTicketId = response.data.ticketId; 
        
        if (attachment) {
          const formData = new FormData();
          formData.append("file", attachment);

          axios.post(`http://localhost:8081/api/tickets/${createdTicketId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            .then(() => {
              alert("Harika! Biletiniz ve dosyanız başarıyla gönderildi.");
              resetForm();
            })
            .catch(error => {
              console.error("Dosya yükleme hatası:", error);
              alert("Biletiniz açıldı ancak dosya yüklenirken bir sorun oluştu.");
            });
        } else {
          alert("Harika! Destek biletiniz başarıyla oluşturuldu.");
          resetForm();
        }
      })
      .catch(error => {
        console.error("Bilet oluşturma hatası:", error);
        alert("Bilet oluşturulamadı. Sunucu bağlantısını kontrol edin.");
      });
  };

  // ==========================================
  // DÜZELTİLEN KISIM: ARTIK PROFİLE YÖNLENDİRİYOR
  // ==========================================
  const handleProfileClick = () => {
    navigate('/profile'); 
    setIsMenuOpen(false); 
  };

  const faqList = [
    { id: 1, q: "DESTEK BİLETİ OLUŞTURDUKTAN SONRA NE OLUR?", a: "Biletiniz destek ekibimize ulaşır ve işleme alınır. Çözüm süreci başladığında bilgilendirilirsiniz." },
    { id: 2, q: "ŞİFREMİ UNUTURSAM NE YAPMALIYIM?", a: "Giriş ekranındaki 'Şifremi Unuttum' bağlantısına tıklayarak e-posta adresinizi girin." },
    { id: 3, q: "BİLETİMİN ÇÖZÜM SÜRESİ NE KADARDIR?", a: "Çözüm süresi biletin öncelik durumuna bağlı olarak değişir. Genellikle 24 saat içinde dönüş sağlanır." }
  ];

  return (
    <div className="container mt-4 mb-5">
      
      <nav className="navbar navbar-light bg-white shadow-sm rounded mb-4 px-4 py-3 position-relative">
        <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h4 text-primary fw-bold">Müşteri Destek Paneli</span>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted fw-bold d-none d-md-block">Hoş geldin, {userName}</span>
            
            <button onClick={toggleMenu} className="btn btn-light border shadow-sm fs-5 px-3 py-1 position-relative" style={{ cursor: 'pointer' }}>
              &#9776;
              {hasNotification && (
                <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">Yeni bildirim</span>
                </span>
              )}
            </button>

            {isMenuOpen && (
              <div className="position-absolute bg-white border rounded shadow-lg p-2" style={{ top: '100%', right: '20px', width: '260px', zIndex: 1050, marginTop: '5px' }}>
                <ul className="list-unstyled mb-0">
                  <li><button onClick={handleProfileClick} className="btn btn-light text-start w-100 fw-bold border-0 rounded mb-1">Profilim</button></li>
                  
                  <li>
                    <button 
                      onClick={() => { navigate('/past-tickets'); setIsMenuOpen(false); }} 
                      className="btn btn-light text-start w-100 fw-bold text-dark border-0 rounded mb-1 d-flex justify-content-between align-items-center"
                    >
                      Geçmiş Destek Taleplerim
                      {hasNotification && <span className="badge bg-danger rounded-pill shadow-sm">Yeni Mesaj</span>}
                    </button>
                  </li>

                  <li><hr className="dropdown-divider my-2" /></li>
                  <li><button onClick={handleLogout} className="btn btn-danger text-start w-100 fw-bold border-0 rounded">Çıkış Yap</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-md-8 mx-auto mb-5">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Yeni Destek Bileti Oluştur</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleCreateTicket}>
                <div className="mb-3">
                  <label className="fw-bold mb-1">Konu Başlığı</label>
                  <input type="text" className="form-control" placeholder="Sorununuzu kısaca özetleyin" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-bold mb-1">Kategori</label>
                    <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="1">Donanım</option>
                      <option value="2">Yazılım</option>
                      <option value="3">Ağ & İnternet</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="fw-bold mb-1">Öncelik Durumu</label>
                    <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="Düşük">Düşük (Acil Değil)</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksek">Yüksek (Çok Acil)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-light rounded border">
                  <label className="fw-bold mb-2">Detaylı Açıklama & Dosya Eki</label>
                  <textarea className="form-control border-0 shadow-sm mb-3" rows="4" placeholder="Lütfen yaşadığınız sorunu detaylıca anlatın..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  
                  <div className="d-flex align-items-center border-top pt-3">
                    <span className="me-2 text-secondary fw-bold" style={{ fontSize: '0.9rem' }}>📎 Ekran Görüntüsü (İsteğe Bağlı):</span>
                    <input type="file" className="form-control form-control-sm w-auto shadow-none" onChange={(e) => setAttachment(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm py-2">Bileti Gönder</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <h6 className="mb-4 text-muted fw-bold" style={{ letterSpacing: '2px' }}>SIKÇA SORULAN SORULAR</h6>
          <div className="accordion accordion-flush" id="faqAccordion">
            {faqList.map((faq) => (
              <div className="accordion-item border-0 border-bottom" key={faq.id}>
                <h2 className="accordion-header">
                  <button 
                    className={`accordion-button ${activeFaq === faq.id ? '' : 'collapsed'} shadow-none bg-transparent text-dark`} 
                    type="button" 
                    onClick={() => toggleFaq(faq.id)}
                    style={{ letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '500', padding: '1.25rem 0' }}
                  >
                    {faq.q}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${activeFaq === faq.id ? 'show' : ''}`}>
                  <div className="accordion-body text-muted px-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;