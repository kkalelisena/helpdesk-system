import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      alert("Lütfen e-posta adresinizi girin!");
      return;
    }

    // İŞTE DÜZELTİLEN KISIM BURASI:
    // Maili linkin sonuna değil, { email: email } şeklinde bir paket olarak gönderiyoruz.
    axios.post("http://localhost:8081/api/users/forgot-password", { email: email })
      .then(response => {
        // Java'dan gelen mesajı (Örn: "Şifreniz mailinize gönderildi") ekrana yansıtıyoruz
        setMessage(response.data);
        alert(response.data);
      })
      .catch(error => {
        console.error("Hata:", error);
        alert(error.response?.data || "Bu e-posta adresi sistemde bulunamadı.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 mt-5">
            <div className="card-header bg-danger text-white text-center py-4">
              <h4>Şifremi Unuttum</h4>
              <p className="mb-0 small">Hesabınızı Kurtarın</p>
            </div>
            <div className="card-body p-4">
              {message && <div className="alert alert-success small text-center fw-bold">{message}</div>}
              
              <p className="text-muted small mb-4 text-center">
                Sisteme kayıtlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız için bir bağlantı/kod göndereceğiz.
              </p>
              
              <div className="mb-4">
                <label className="fw-bold mb-1">E-posta Adresi:</label>
                <input type="email" className="form-control" placeholder="ornek@sirket.com" 
                       value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              
              <button className="btn btn-danger btn-lg w-100 mb-3 shadow-sm" onClick={handleResetPassword}>
                Şifre Sıfırlama Linki Gönder
              </button>
              
              <div className="text-center mt-3">
                <span className="text-muted small">Şifrenizi hatırladınız mı? </span>
                <Link to="/login" className="text-decoration-none fw-bold text-danger">Giriş Yap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;