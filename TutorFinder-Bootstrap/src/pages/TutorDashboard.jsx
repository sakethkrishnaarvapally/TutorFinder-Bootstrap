import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getRequestsForTutor, updateRequestStatus } from "../utils/requests.js";
import StudentFooter from "../components/StudentFooter.jsx";

const schedule = [
  { day: "Monday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Tuesday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Wednesday", time: "Not Available", available: false },
  { day: "Thursday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Friday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Saturday", time: "10:00 AM - 2:00 PM", available: true },
];

export default function TutorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const tutorId = user?.id ?? user?._id;
  const [requests, setRequests] = useState([]);

  const loadRequests = useCallback(() => {
    setRequests(tutorId ? getRequestsForTutor(tutorId) : []);
  }, [tutorId]);

  useEffect(() => {
    loadRequests();
    window.addEventListener("requestsUpdated", loadRequests);
    window.addEventListener("storage", loadRequests);
    return () => {
      window.removeEventListener("requestsUpdated", loadRequests);
      window.removeEventListener("storage", loadRequests);
    };
  }, [loadRequests]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const acceptedRequests = requests.filter((r) => r.status === "accepted");

  function updateStatus(id, status) {
    if (!updateRequestStatus(id, status)) return;
    loadRequests();
    window.alert(status === "accepted" ? "Student request accepted successfully!" : "Student request rejected successfully!");
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const profileFields = [
    ["Subject", user?.subject || "Not added", "bi-book"],
    ["Qualification", user?.qualification || "Not added", "bi-mortarboard"],
    ["Experience", user?.experience || "Not added", "bi-briefcase"],
    ["Location", user?.location || "Not added", "bi-geo-alt"],
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg tf-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand tf-brand" href="#dashboard">📚 Tutor<span>Finder</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#tutorNav" aria-controls="tutorNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
          <div className="collapse navbar-collapse" id="tutorNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <a className="nav-link fw-semibold" href="#dashboard">Dashboard</a>
              <a className="nav-link fw-semibold" href="#students">Students</a>
              <a className="nav-link fw-semibold" href="#requests">Requests</a>
              <a className="nav-link fw-semibold" href="#schedule">Schedule</a>
              <button className="btn btn-outline-danger btn-sm ms-lg-2" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1" />Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <section id="dashboard" className="tf-hero p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8"><span className="small fw-bold text-white-50 text-uppercase" style={{ letterSpacing: ".14em" }}>Tutor Dashboard</span><h1 className="display-6 fw-bold mt-2 mb-2">Welcome, {user?.name || "Tutor"}! 👋</h1><p className="text-white-50 mb-0">Manage your students, requests, schedule and teaching profile.</p></div>
            <div className="col-lg-4"><div className="rounded-4 bg-white bg-opacity-10 border border-white border-opacity-25 p-3 d-flex align-items-center gap-3"><span className="display-4">👨‍🏫</span><div><strong className="d-block">Teach. Inspire. Grow.</strong><small className="text-white-50">Make learning easier for students.</small></div></div></div>
          </div>
        </section>

        <section className="row g-3 mb-4">
          {[
            ["Total Students", acceptedRequests.length, "bi-people", "primary"],
            ["Pending Requests", pendingCount, "bi-envelope-paper", "success"],
            ["Classes This Week", 8, "bi-calendar-week", "warning"],
            ["Rating", user?.rating || "New", "bi-star", "info"],
          ].map(([label, value, icon, color]) => (
            <div className="col-6 col-xl-3" key={label}>
              <div className="card tf-soft-card h-100"><div className="card-body d-flex align-items-center gap-3 p-3 p-md-4"><div className={`tf-icon-box bg-${color}-subtle text-${color}`}><i className={`bi ${icon}`} /></div><div><div className="small text-secondary">{label}</div><div className="fs-3 fw-bold">{value}</div></div></div></div>
            </div>
          ))}
        </section>

        <section id="requests" className="card tf-soft-card border-0 mb-4 scroll-mt">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3"><div><span className="tf-section-label">Student requests</span><h2 className="h3 fw-bold mt-1 mb-0">Recent Requests</h2></div><span className="badge text-bg-primary">{pendingCount} pending</span></div>
            {requests.length === 0 ? <div className="tf-empty"><div className="display-5">📩</div><h3 className="h5 fw-bold text-dark mt-3">No Student Requests</h3><p className="mb-0">New student requests will appear here.</p></div> :
              <div className="list-group list-group-flush">
                {[...requests].reverse().map((request) => (
                  <div className="list-group-item px-0 py-3" key={request.id}>
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                      <div className="d-flex align-items-center gap-3"><div className="tf-icon-box bg-primary-subtle">👨‍🎓</div><div><h3 className="h6 fw-bold mb-1">{request.studentName || "Student"}</h3><p className="small text-secondary mb-1">{request.subject}</p><small className="text-secondary">Requested {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ""}</small>{request.message && <p className="small mt-1 mb-0">{request.message}</p>}</div></div>
                      <div className="d-flex flex-wrap align-items-center gap-2"><span className={`tf-status ${request.status}`}>{request.status}</span>{request.status === "pending" && <><button className="btn btn-success btn-sm" onClick={() => updateStatus(request.id, "accepted")}><i className="bi bi-check-lg me-1" />Accept</button><button className="btn btn-outline-danger btn-sm" onClick={() => updateStatus(request.id, "rejected")}><i className="bi bi-x-lg me-1" />Reject</button></>}</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </section>

        <section className="card tf-soft-card border-0 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3"><div><span className="tf-section-label">Teacher profile</span><h2 className="h3 fw-bold mt-1 mb-0">My Profile</h2></div></div>
            <div className="row g-4 align-items-center">
              <div className="col-md-3 text-center"><div className="display-1">👨‍🏫</div><h3 className="h5 fw-bold mt-2">{user?.name}</h3><span className="badge text-bg-light text-primary">Tutor</span></div>
              <div className="col-md-6"><div className="row g-3">{profileFields.map(([label, value, icon]) => <div className="col-sm-6" key={label}><div className="p-3 rounded-3 bg-light h-100"><div className="small text-secondary"><i className={`bi ${icon} me-2`} />{label}</div><strong>{value}</strong></div></div>)}</div></div>
              <div className="col-md-3"><div className="rounded-3 bg-primary-subtle text-primary p-3 text-center"><div className="small">Hourly Fee</div><div className="fs-2 fw-bold">₹{user?.fee || 0}</div><small>per hour</small></div></div>
            </div>
          </div>
        </section>

        <section id="schedule" className="card tf-soft-card border-0 mb-4 scroll-mt">
          <div className="card-body p-3 p-md-4">
            <span className="tf-section-label">My schedule</span><h2 className="h3 fw-bold mt-1 mb-3">Weekly Availability</h2>
            <div className="row g-3">
              {schedule.map((day) => <div className="col-sm-6 col-lg-4" key={day.day}><div className="border rounded-3 p-3 h-100"><div className="fw-bold">{day.day}</div><div className="text-secondary small my-2">{day.time}</div><span className={`badge ${day.available ? "text-bg-success" : "text-bg-secondary"}`}>{day.available ? "Available" : "Unavailable"}</span></div></div>)}
            </div>
          </div>
        </section>

        <section id="students" className="card tf-soft-card border-0 scroll-mt">
          <div className="card-body p-3 p-md-4">
            <span className="tf-section-label">My students</span><h2 className="h3 fw-bold mt-1 mb-3">Accepted Students</h2>
            {acceptedRequests.length === 0 ? <p className="text-secondary mb-0">Accepted student requests will appear here.</p> :
              <div className="table-responsive"><table className="table table-hover mb-0"><thead className="table-light"><tr><th>Student</th><th>Subject</th><th>Request Date</th><th>Status</th></tr></thead><tbody>{acceptedRequests.map((r) => <tr key={r.id}><td>{r.studentName}</td><td>{r.subject}</td><td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td><td><span className="tf-status accepted">Accepted</span></td></tr>)}</tbody></table></div>
            }
          </div>
        </section>
      </main>
      <StudentFooter />
    </>
  );
}
