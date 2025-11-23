import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mahasiswa" // Default role
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password, role);
    if (result.success) {
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } else {
      alert(result.msg);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Daftar ITS EventHub</h2>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Nama Lengkap"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          placeholder="Email ITS (atau umum)"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <select name="role" value={role} onChange={onChange}>
          <option value="mahasiswa">Mahasiswa (Peserta)</option>
          <option value="panitia">Panitia (Event Organizer)</option>
        </select>
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
};

export default Register;