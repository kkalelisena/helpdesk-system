import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const userCredentials = { email, password };

    axios.post('http://localhost:8081/api/users/login', userCredentials)
      .then(response => {
        const loggedInUser = response.data;
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        // Rol kontrolü (1: Admin, 2: Müşteri)
        if (loggedInUser.role && loggedInUser.role.roleId === 1) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch(error => {
        alert(error.response?.data || "E-posta veya şifre hatalı!");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-white text-center py-3" style={{ backgroundColor: '#198754' }}>
              <h4 className="fw-bold mb-0">Müşteri Destek Sistemine Giriş</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="fw-bold mb-1">E-posta Adresi:</label>
                  <input 
                    type="email" 
                    className="form-control bg-light" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="fw-bold mb-1">Şifreniz:</label>
                  <input 
                    type="password" 
                    className="form-control bg-light" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                </div>
                
                {/* İŞTE EKSİK OLAN KISIM: ŞİFREMİ UNUTTUM LİNKİ */}
                <div className="text-end mb-4">
                  <Link to="/forgot-password" style={{ color: '#198754', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                    Şifremi Unuttum?
                  </Link>
                </div>

                <button type="submit" className="btn w-100 fw-bold text-white mb-3 shadow-sm" style={{ backgroundColor: '#198754', padding: '10px' }}>
                  Sisteme Giriş Yap
                </button>
              </form>
              <div className="text-center">
                <span className="text-muted">Henüz hesabınız yok mu? </span>
                <Link to="/register" style={{ color: '#198754', fontWeight: 'bold', textDecoration: 'none' }}>Kayıt Ol</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;