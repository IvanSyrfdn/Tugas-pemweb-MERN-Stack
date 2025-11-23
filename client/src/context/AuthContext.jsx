import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  
  // Karena AuthProvider butuh navigasi, kita pastikan dia dipanggil di dalam Router nanti
  // Tapi untuk amannya, kita handle navigasi di component Login saja.

  // Cek apakah user sudah login saat aplikasi pertama dibuka
  useEffect(() => {
    if (token) {
      // Opsi: Bisa panggil API 'get current user' di sini untuk validasi token
      // Untuk simpelnya, kita anggap token valid dulu dan decode data user (opsional)
      // Atau sekadar set state bahwa ada token.
      api.defaults.headers.common["x-auth-token"] = token;
    }
    setLoading(false);
  }, [token]);

  // Fungsi Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      
      // Ambil token & user dari response backend
      const { token: newToken, user: userData } = res.data;

      // Simpan ke State & LocalStorage (Sesuai Syarat Tugas)
      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      
      // Set default header axios biar request berikutnya otomatis bawa token
      api.defaults.headers.common["x-auth-token"] = newToken;
      
      return { success: true };
    } catch (err) {
      console.error(err.response.data);
      return { success: false, msg: err.response.data.msg || "Login gagal" };
    }
  };

  // Fungsi Register
  const register = async (name, email, password, role) => {
    try {
      await api.post("/auth/register", { name, email, password, role });
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.response.data.msg || "Register gagal" };
    }
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};