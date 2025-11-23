import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State untuk pesan error
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Hilangkan error saat user mulai mengetik
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    
    const result = await login(email, password);
    
    if (result.success) {
      // SUKSES: Langsung pindah halaman tanpa alert
      navigate("/");
    } else {
      // GAGAL: Set pesan error untuk ditampilkan di UI
      setError(result.msg || "Email atau password salah");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px", borderRadius: "15px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">Masuk EventHub</h3>
          <p className="text-muted">Login untuk melihat info kampus</p>
        </div>
        
        {/* Tampilkan Kotak Error jika ada error */}
        {error && (
          <div className="alert alert-danger text-center p-2 mb-3 small border-0 bg-danger bg-opacity-10 text-danger fw-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email ITS</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="contoh@mhs.its.ac.id"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="******"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Masuk Sekarang</button>
        </form>
        
        <div className="text-center mt-3">
          <small>Belum punya akun? <Link to="/register">Daftar disini</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Login;