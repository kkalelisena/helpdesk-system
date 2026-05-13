import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const [showDeleteSteps, setShowDeleteSteps] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!loggedInUser) return null;

  // ==========================================
  // YENİ: ŞİFRE GÜCÜNÜ ÖLÇEN MOTOR
  // ==========================================
  const checkPasswordStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1; // Büyük harf var mı?
    if (/[0-9]/.test(pass)) score += 1; // Sayı var mı?
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Özel karakter var mı?

    if (score <= 2) return { text: "Zayıf", color: "bg-danger", textColor: "text-danger", width: "33%" };
    if (score <= 4) return { text: "Orta", color: "bg-warning", textColor: "text-warning", width: "66%" };
    return { text: "Güçlü", color: "bg-success", textColor: "text-success", width: "100%" };
  };

  const strength = checkPasswordStrength(newPassword);

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      alert("Şifreniz çok zayıf. Lütfen en az 6 karakterli bir şifre belirleyin!");
      return;
    }
    axios.put(`http://localhost:8081/api/users/${loggedInUser.userId}/change-password`, { newPassword })
      .then(() => {
        alert("Şifreniz başarıyla değiştirildi!");
        setShowPassModal(false);
        setNewPassword("");
      })
      .catch(() => alert("Şifre güncellenemedi."));
  };

  const handleFinalDelete = () => {
    axios.delete(`http://localhost:8081/api/users/${loggedInUser.userId}`)
      .then(() => {
        alert("Hesabınız silindi. Sizi özleyeceğiz... 😢");
        localStorage.removeItem('user');
        navigate('/login');
      })
      .catch(() => alert("Hesap silinirken bir hata oluştu."));
  };

  return (
    <div className="container mt-5 px-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Kişisel Bilgilerim</h5>
              <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-light fw-bold">Geri Dön</button>
            </div>
            <div className="card-body p-4">
              <div className="mb-3 border-bottom pb-2">
                <label className="text-muted small fw-bold">AD SOYAD</label>
                <p className="fs-5 mb-0 fw-bold">{loggedInUser.fullName}</p>
              </div>
              <div className="mb-3 border-bottom pb-2">
                <label className="text-muted small fw-bold">E-POSTA ADRESİ</label>
                <p className="fs-5 mb-0 text-primary">{loggedInUser.email}</p>
              </div>
              <div className="mt-4 d-grid">
                <button onClick={() => setShowPassModal(true)} className="btn btn-outline-primary fw-bold">🔐 Şifre Değiştir</button>
              </div>
            </div>
          </div>

          <div className="card border-danger bg-danger bg-opacity-10 shadow-sm">
            <div className="card-body text-center py-4">
              <h6 className="text-danger fw-bold mb-3">Hesabımı Kapat</h6>
              <p className="small text-muted mb-3">Bu işlem geri alınamaz ve tüm biletleriniz silinir.</p>
              <button onClick={() => setShowDeleteSteps(true)} className="btn btn-sm btn-danger fw-bold px-4">Hesabı Sil</button>
            </div>
          </div>

        </div>
      </div>

      {/* ŞİFRE DEĞİŞTİRME MODAL */}
      {showPassModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Yeni Şifre Belirle</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {setShowPassModal(false); setNewPassword("");}}></button>
              </div>
              <div className="modal-body p-4">
                <input 
                  type="password" 
                  className="form-control mb-2" 
                  placeholder="Yeni şifrenizi yazın..." 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                
                {/* ŞİFRE GÜCÜ ÇUBUĞU */}
                {strength && (
                  <div className="mb-3">
                    <div className="progress" style={{ height: '6px' }}>
                      <div className={`progress-bar ${strength.color} progress-bar-striped progress-bar-animated`} style={{ width: strength.width }}></div>
                    </div>
                    <small className={`fw-bold mt-1 d-block ${strength.textColor}`}>
                      {strength.text} Şifre
                    </small>
                  </div>
                )}

                <button onClick={handleChangePassword} className="btn btn-primary w-100 fw-bold mt-2">Güncelle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HESAP SİLME ONAY MODAL */}
      {showDeleteSteps && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Ayrılmanıza Üzüldük...</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {setShowDeleteSteps(false); setConfirmDelete(false);}}></button>
              </div>
              <div className="modal-body p-4">
                {!confirmDelete ? (
                  <>
                    <p className="fw-bold mb-3">Neden ayrılmak istiyorsunuz? (Bize yardımcı olun)</p>
                    {["Uygulamayı beğenmedim.", "Artık işime yaramıyor.", "Çok karmaşık geldi.", "Başka bir uygulama buldum.", "Diğer"].map(reason => (
                      <div className="form-check mb-2" key={reason}>
                        <input className="form-check-input" type="radio" name="reason" value={reason} onChange={(e) => setDeleteReason(e.target.value)} />
                        <label className="form-check-label">{reason}</label>
                      </div>
                    ))}
                    <button disabled={!deleteReason} onClick={() => setConfirmDelete(true)} className="btn btn-danger w-100 mt-4 fw-bold">Devam Et</button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <h4 className="fw-bold text-danger mb-3">SON KARARINIZ MI?</h4>
                    <p className="mb-4 text-muted">Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                    <div className="d-flex gap-3">
                      <button onClick={() => setShowDeleteSteps(false)} className="btn btn-secondary w-50 fw-bold">Hayır, Vazgeçtim</button>
                      <button onClick={handleFinalDelete} className="btn btn-danger w-50 fw-bold shadow">Evet, Hesabımı Sil</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;