import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua"); 
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Gagal ambil event", err);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    // LANGSUNG HAPUS TANPA TANYA (No Confirm Dialog)
    try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter(event => event._id !== id));
    } catch (err) {
        console.error("Gagal menghapus", err);
    }
  };

  const categories = ["Semua", "Seminar", "Workshop", "Lomba", "Hiburan", "Lainnya"];

  const filteredEvents = selectedCategory === "Semua" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow sticky-top">
        <div className="container">
          <span className="navbar-brand fw-bold">🚀 ITS EventHub</span>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white d-none d-md-block">Halo, <b>{user.name}</b></span>
                <Link to="/add-event" className="btn btn-light btn-sm fw-bold text-primary">+ Buat Event</Link>
                <button onClick={logout} className="btn btn-danger btn-sm">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-light btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-bottom pb-3 mb-4">
          <h2 className="fw-bold text-dark m-0">📅 Event Terbaru</h2>
          <div className="d-flex gap-2 mt-3 mt-md-0 overflow-auto" style={{ maxWidth: "100%" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-pill px-3 fw-bold ${selectedCategory === cat ? "btn-primary" : "btn-outline-secondary"}`}
                style={{ whiteSpace: "nowrap" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">Tidak ada event di kategori "{selectedCategory}" 😔</h4>
            <button onClick={() => setSelectedCategory("Semua")} className="btn btn-link">Tampilkan Semua</button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredEvents.map((event) => (
              <div className="col" key={event._id}>
                <div className="card h-100 shadow-sm border-0 hover-shadow">
                  <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2 shadow-sm">
                      {event.category || "Lainnya"}
                    </span>
                    <img 
                      src={`http://localhost:5000/${event.image.replace(/\\/g, "/")}`} 
                      className="card-img-top" 
                      alt={event.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }}
                    />
                  </div>
                  <div className="card-body">
                    <small className="text-primary fw-bold">
                      📅 {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                    </small>
                    <h5 className="card-title fw-bold mt-2">{event.title}</h5>
                    <p className="card-text text-muted small mb-1">📍 {event.location}</p>
                    <p className="card-text text-muted small">👤 {event.organizer}</p>
                    <p className="card-text text-truncate">{event.description}</p>
                  </div>
                  
                  {user && user.id === event.user._id && (
                    <div className="card-footer bg-white border-top-0 text-end">
                       <Link to={`/edit-event/${event._id}`} className="btn btn-outline-warning btn-sm me-2">✏️ Edit</Link>
                       <button onClick={() => handleDelete(event._id)} className="btn btn-outline-danger btn-sm">🗑 Hapus</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;