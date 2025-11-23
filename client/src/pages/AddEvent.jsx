import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState("Lainnya");
  const [image, setImage] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // State Error

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Reset error
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("organizer", organizer);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // SUKSES: Langsung balik ke dashboard
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
      // GAGAL: Tampilkan pesan
      setErrorMsg("Gagal upload. Pastikan semua data terisi dan file gambar valid.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-primary text-white p-3">
              <h4 className="mb-0 fw-bold">📝 Tambah Event Baru</h4>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={onSubmit}>
                
                {/* Judul */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Judul Event</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                {/* Tanggal & Kategori */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tanggal</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Kategori</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Seminar">Seminar</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Lomba">Lomba</option>
                      <option value="Hiburan">Hiburan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Lokasi & Penyelenggara */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Lokasi</label>
                    <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Penyelenggara</label>
                    <input type="text" className="form-control" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required />
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Deskripsi</label>
                  <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>

                {/* Upload Gambar */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Poster Event</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required />
                </div>

                {/* Error Message Inline */}
                {errorMsg && <div className="alert alert-danger py-2 mb-3 small">{errorMsg}</div>}

                {/* Tombol */}
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" onClick={() => navigate("/")} className="btn btn-outline-secondary px-4">Batal</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
                    {loading ? "Mengupload..." : "Simpan Event"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;