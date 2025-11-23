import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", date: "", location: "", organizer: "", category: "Lainnya",
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(""); // Error inline

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            location: event.location,
            organizer: event.organizer,
            category: event.category
        });
        setCurrentImage(event.image);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/"); // Balik dashboard kalau error
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("organizer", formData.organizer);
    data.append("category", formData.category);
    if (image) data.append("image", image);

    try {
      await api.put(`/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // SUKSES: Langsung redirect
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengupdate event.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark fw-bold">✏️ Edit Event</div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* Form Fields (Sama seperti AddEvent tapi pakai formData) */}
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={onChange} required />
                </div>
                
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tanggal</label>
                        <input type="date" className="form-control" name="date" value={formData.date} onChange={onChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Kategori</label>
                        <select className="form-select" name="category" value={formData.category} onChange={onChange}>
                            <option value="Seminar">Seminar</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Lomba">Lomba</option>
                            <option value="Hiburan">Hiburan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                </div>
                <div className="mb-3"><label className="form-label">Lokasi</label><input type="text" className="form-control" name="location" value={formData.location} onChange={onChange} required /></div>
                <div className="mb-3"><label className="form-label">Penyelenggara</label><input type="text" className="form-control" name="organizer" value={formData.organizer} onChange={onChange} required /></div>
                <div className="mb-3"><label className="form-label">Deskripsi</label><textarea className="form-control" rows="4" name="description" value={formData.description} onChange={onChange} required></textarea></div>

                <div className="mb-3">
                    <label className="form-label">Ganti Poster (Opsional)</label>
                    <div className="mb-2">
                        <small className="text-muted">Poster Saat Ini:</small><br/>
                        <img src={`http://localhost:5000/${currentImage}`} width="100" className="rounded border"/>
                    </div>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                {errorMsg && <div className="alert alert-danger py-2 mb-3 small">{errorMsg}</div>}

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={() => navigate("/")} className="btn btn-secondary">Batal</button>
                    <button type="submit" className="btn btn-warning fw-bold">Update Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;