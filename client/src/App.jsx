import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // <-- Import Dashboard yg baru
import AddEvent from "./pages/AddEvent";   // <-- Import AddEvent
import EditEvent from "./pages/EditEvent"; // Import EditEvent


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;