import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ŞİFRE GÜCÜNÜ ÖLÇEN MOTOR
  const checkPasswordStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1; 
    if (/[0-9]/.test(pass)) score += 1; 
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; 

    if (score <= 2) return { text: "Zayıf", color: "bg-danger", textColor: "text-danger", width: "33%" };
    if (score <= 4) return { text: "Orta", color: "bg-warning", textColor: "text-warning", width: "66%" };
    return { text: "Güçlü", color: "bg-success", textColor: "text-success", width: "100%" };
  };

  const strength = checkPasswordStrength(password);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    if (password.length < 6) {
      alert("Güvenliğiniz için lütfen en az 6 karakterli bir şifre belirleyin!");
      return;
    }

    const newUser = { fullName, email, password };

    axios.post('http://localhost:8081/api/users/register', newUser)
      .then(response => {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        navigate('/login');
      })
      .catch(error => {
        // --- [object Object] HATASINI ÇÖZEN AKILLI KONTROL ---
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          
          if (typeof errorData === 'string') {
            alert(errorData); // Eğer direkt yazıysa göster ("Bu e-posta zaten kullanımda" gibi)
          } else if (errorData.message) {
            alert("Hata: " + errorData.message); // Obje içinde message varsa onu göster
          } else {
            alert("Detaylı Hata:\n" + JSON.stringify(errorData)); // Hiçbiri değilse objeyi string'e çevirip göster
          }
        } else {
          alert("Kayıt olurken sunucuya ulaşılamadı.");
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="fw-bold mb-0">Sisteme Kayıt Ol</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Ad Soyad</label>
                  <input type="text" className="form-control shadow-sm" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Örn: Sena Kaleli" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">E-posta Adresi</label>
                  <input type="email" className="form-control shadow-sm" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@ornek.com" />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Şifre Belirle</label>
                  <input type="password" className="form-control shadow-sm mb-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifrenizi oluşturun" />
                  
                  {/* ŞİFRE GÜCÜ ÇUBUĞU */}
                  {strength && (
                    <div className="mb-1">
                      <div className="progress" style={{ height: '6px' }}>
                        <div className={`progress-bar ${strength.color} progress-bar-striped progress-bar-animated`} style={{ width: strength.width }}></div>
                      </div>
                      <small className={`fw-bold mt-1 d-block ${strength.textColor}`}>
                        {strength.text} Şifre
                      </small>
                    </div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary w-100 fw-bold shadow">Kayıt Ol</button>
              </form>
              <div className="text-center mt-3">
                <span className="text-muted">Zaten hesabın var mı? </span>
                <Link to="/login" className="text-primary fw-bold text-decoration-none">Giriş Yap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;