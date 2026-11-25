import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudentNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg tf-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand tf-brand" to="/student" aria-label="TutorFinder dashboard">
          📚 Tutor<span>Finder</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#studentNavigation" aria-controls="studentNavigation" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="studentNavigation">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <NavLink className="nav-link fw-semibold" to="/student">Dashboard</NavLink>
            <a className="nav-link fw-semibold" href="/student#my-requests">My Requests</a>
            <button className="btn btn-sm btn-outline-danger ms-lg-2" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
