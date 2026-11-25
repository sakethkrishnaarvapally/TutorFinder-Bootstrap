import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../utils/storage.js";
import { getRequests, saveRequests } from "../utils/requests.js";
import { useAuth } from "../context/AuthContext.jsx";
import StudentFooter from "../components/StudentFooter.jsx";

const formatDate = (iso) => iso ? new Date(iso).toLocaleString() : "Before tracking";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const loadData = useCallback(() => {
    setUsers(getUsers());
    setRequests(getRequests());
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("requestsUpdated", loadData);
    const timer = window.setInterval(loadData, 3000);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("requestsUpdated", loadData);
      window.clearInterval(timer);
    };
  }, [loadData]);

  const students = users.filter((u) => u.role?.toLowerCase() === "student");
  const tutors = users.filter((u) => u.role?.toLowerCase() === "tutor");
  const activeTutors = tutors.filter((t) => ["approved", "active"].includes(t.status?.toLowerCase()));
  const pendingRequests = requests.filter((r) => r.status?.toLowerCase() === "pending");
  const recent = [...users].filter((u) => u.role?.toLowerCase() !== "admin").sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

  function deleteUser(id, name) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    saveUsers(users.filter((u) => String(u.id) !== String(id)));
    loadData();
  }
  function approveTutor(id) {
    saveUsers(users.map((u) => String(u.id) === String(id) ? { ...u, status: "approved" } : u));
    loadData();
  }
  function updateRequest(id, status) {
    saveRequests(requests.map((r) => String(r.id) === String(id) ? { ...r, status } : r));
    loadData();
  }
  function handleLogout() { logout(); navigate("/login"); }
  function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

  const sections = [["top", "Dashboard"], ["users", "Students"], ["tutors", "Tutors"], ["requests", "Requests"], ["recent", "Recent"]];

  return (
    <>
      <nav className="navbar navbar-expand-lg tf-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand tf-brand" href="#top">📚 Tutor<span>Finder</span> <span className="badge text-bg-primary ms-1 fs-6">Admin</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav" aria-controls="adminNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
          <div className="collapse navbar-collapse" id="adminNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              {sections.map(([id, label]) => <button key={id} className="btn btn-link nav-link fw-semibold text-decoration-none" onClick={() => scrollTo(id)}>{label}</button>)}
              <button className="btn btn-outline-danger btn-sm ms-lg-2" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5" id="top">
        <section className="tf-hero p-4 p-lg-5 mb-4">
          <span className="small fw-bold text-white-50 text-uppercase" style={{ letterSpacing: ".14em" }}>Administration</span>
          <h1 className="display-6 fw-bold mt-2 mb-2">Admin Dashboard</h1>
          <p className="text-white-50 mb-0">Manage students, tutors and platform activities from one place.</p>
        </section>

        <section className="row g-3 mb-4">
          {[
            ["Total Students", students.length, "bi-people", "primary"],
            ["Total Tutors", tutors.length, "bi-person-workspace", "info"],
            ["Pending Requests", pendingRequests.length, "bi-envelope-paper", "warning"],
            ["Active Tutors", activeTutors.length, "bi-person-check", "success"],
          ].map(([label, value, icon, tone]) => <div className="col-6 col-xl-3" key={label}><div className="card tf-soft-card h-100"><div className="card-body d-flex align-items-center gap-3"><div className={`tf-icon-box bg-${tone}-subtle text-${tone}`}><i className={`bi ${icon}`} /></div><div><div className="small text-secondary">{label}</div><div className="fs-2 fw-bold">{value}</div></div></div></div></div>)}
        </section>

        <section className="card tf-soft-card border-0 mb-4 scroll-mt" id="users">
          <div className="card-body p-3 p-md-4"><div className="d-flex justify-content-between align-items-center mb-3"><div><span className="tf-section-label">User management</span><h2 className="h3 fw-bold mt-1 mb-0">Registered Students</h2></div><button className="btn btn-outline-primary btn-sm" onClick={loadData}><i className="bi bi-arrow-clockwise me-1" />Refresh</button></div>
            <div className="table-responsive"><table className="table table-hover mb-0"><thead className="table-light"><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead><tbody>{students.length === 0 ? <tr><td colSpan="4" className="text-center text-secondary py-4">No students have registered yet.</td></tr> : students.map((u) => <tr key={u.id}><td className="fw-semibold">{u.name}</td><td>{u.email}</td><td>Student</td><td><button className="btn btn-outline-danger btn-sm" onClick={() => deleteUser(u.id, u.name)}>Delete</button></td></tr>)}</tbody></table></div>
          </div>
        </section>

        <section className="card tf-soft-card border-0 mb-4 scroll-mt" id="tutors">
          <div className="card-body p-3 p-md-4"><span className="tf-section-label">Tutor management</span><h2 className="h3 fw-bold mt-1 mb-3">Registered Tutors</h2>
            <div className="table-responsive"><table className="table table-hover mb-0"><thead className="table-light"><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Action</th></tr></thead><tbody>{tutors.length === 0 ? <tr><td colSpan="5" className="text-center text-secondary py-4">No tutors have registered yet.</td></tr> : tutors.map((u) => { const approved = ["approved", "active"].includes(u.status?.toLowerCase()); return <tr key={u.id}><td className="fw-semibold">{u.name}</td><td>{u.email}</td><td>{u.subject || "-"}</td><td><span className={`badge ${approved ? "text-bg-success" : "text-bg-warning"}`}>{approved ? "Approved" : "Pending"}</span></td><td className="d-flex gap-2">{!approved && <button className="btn btn-success btn-sm" onClick={() => approveTutor(u.id)}>Approve</button>}<button className="btn btn-outline-danger btn-sm" onClick={() => deleteUser(u.id, u.name)}>Delete</button></td></tr>; })}</tbody></table></div>
          </div>
        </section>

        <section className="card tf-soft-card border-0 mb-4 scroll-mt" id="requests">
          <div className="card-body p-3 p-md-4"><span className="tf-section-label">Platform activity</span><h2 className="h3 fw-bold mt-1 mb-3">Tutor Requests</h2>
            <div className="table-responsive"><table className="table table-hover mb-0"><thead className="table-light"><tr><th>Student</th><th>Tutor</th><th>Subject</th><th>Status</th><th>Action</th></tr></thead><tbody>{requests.length === 0 ? <tr><td colSpan="5" className="text-center text-secondary py-4">No requests yet.</td></tr> : requests.map((r, index) => <tr key={r.id ?? index}><td>{r.studentName || r.student || "-"}</td><td>{r.tutorName || r.tutor || "-"}</td><td>{r.subject || "-"}</td><td><span className={`tf-status ${(r.status || "pending").toLowerCase()}`}>{r.status || "pending"}</span></td><td>{(r.status || "pending").toLowerCase() === "pending" && <div className="d-flex gap-2"><button className="btn btn-success btn-sm" onClick={() => updateRequest(r.id, "accepted")}>Accept</button><button className="btn btn-outline-danger btn-sm" onClick={() => updateRequest(r.id, "rejected")}>Reject</button></div>}</td></tr>)}</tbody></table></div>
          </div>
        </section>

        <section className="card tf-soft-card border-0 mb-4 scroll-mt" id="recent">
          <div className="card-body p-3 p-md-4"><span className="tf-section-label">Latest activity</span><h2 className="h3 fw-bold mt-1 mb-3">Recently Registered</h2>
            <div className="table-responsive"><table className="table table-hover mb-0"><thead className="table-light"><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{recent.length === 0 ? <tr><td colSpan="4" className="text-center text-secondary py-4">No registrations yet.</td></tr> : recent.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td className="text-capitalize">{u.role}</td><td>{formatDate(u.createdAt)}</td></tr>)}</tbody></table></div>
          </div>
        </section>
      </main>
      <StudentFooter />
    </>
  );
}
