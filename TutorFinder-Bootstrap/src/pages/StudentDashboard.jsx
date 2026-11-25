import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUsers } from "../utils/storage.js";
import { sendTutorRequest, getRequestsForStudent } from "../utils/requests.js";
import { sampleTutors } from "../data/tutors.js";
import StudentNavbar from "../components/StudentNavbar.jsx";
import StudentFooter from "../components/StudentFooter.jsx";

const emptyFilters = { subject: "", location: "", availability: "" };

function matches(tutor, filters) {
  const subject = filters.subject.toLowerCase().trim();
  const location = filters.location.toLowerCase().trim();
  return (
    (!subject || String(tutor.subject || "").toLowerCase().includes(subject)) &&
    (!location || String(tutor.location || "").toLowerCase().includes(location)) &&
    (!filters.availability || tutor.availability === filters.availability)
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.id ?? user?._id;
  const [tutors, setTutors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  const loadTutors = useCallback(() => {
    const registered = getUsers()
      .filter((u) => u.role?.toLowerCase() === "tutor" && ["approved", "active"].includes(u.status?.toLowerCase()))
      .map((u) => ({ ...u, id: u.id ?? u._id, fee: u.fee || 0, rating: u.rating || "New" }));
    const all = [...sampleTutors, ...registered];
    setTutors(all.filter((t, index, arr) => arr.findIndex((x) => String(x.id) === String(t.id)) === index));
  }, []);

  const loadRequests = useCallback(() => {
    setRequests(studentId ? getRequestsForStudent(studentId) : []);
  }, [studentId]);

  useEffect(() => {
    loadTutors();
    loadRequests();
    window.addEventListener("focus", loadTutors);
    window.addEventListener("storage", loadTutors);
    window.addEventListener("storage", loadRequests);
    window.addEventListener("requestsUpdated", loadRequests);
    return () => {
      window.removeEventListener("focus", loadTutors);
      window.removeEventListener("storage", loadTutors);
      window.removeEventListener("storage", loadRequests);
      window.removeEventListener("requestsUpdated", loadRequests);
    };
  }, [loadTutors, loadRequests]);

  const update = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));
  const results = tutors.filter((tutor) => matches(tutor, applied));

  function handleRequest(tutor) {
    if (!user || !studentId) {
      window.alert("Please log in before sending a request.");
      return;
    }
    const result = sendTutorRequest(tutor, user);
    window.alert(result.message);
    if (result.ok) loadRequests();
  }

  const statusClass = (status) => `tf-status ${["pending", "accepted", "rejected"].includes(status?.toLowerCase()) ? status.toLowerCase() : "pending"}`;

  return (
    <>
      <StudentNavbar />
      <main className="container py-4 py-lg-5">
        <section className="tf-hero p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="small fw-bold text-uppercase text-white-50 mb-2" style={{ letterSpacing: ".14em" }}>Student Dashboard</div>
              <h1 className="display-6 fw-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-white-50 mb-0">Find the perfect tutor for your learning needs.</p>
            </div>
            <div className="col-lg-4"><div className="rounded-4 bg-white bg-opacity-10 border border-white border-opacity-25 p-4 d-flex align-items-center gap-3"><span className="display-4">🎓</span><div><strong className="d-block">Learn Smarter</strong><small className="text-white-50">Find. Connect. Learn.</small></div></div></div>
          </div>
        </section>

        <section className="card tf-soft-card border-0 mb-4">
          <div className="card-body p-4">
            <div className="mb-3"><span className="tf-section-label">Find your tutor</span><h2 className="h3 fw-bold mt-1 mb-0">Search for the Perfect Tutor</h2></div>
            <form onSubmit={(event) => { event.preventDefault(); setApplied(form); }}>
              <div className="row g-3 align-items-end">
                <div className="col-md-4"><label className="form-label fw-semibold" htmlFor="subjectSearch">📚 Subject</label><input className="form-control" id="subjectSearch" placeholder="e.g. Mathematics" value={form.subject} onChange={update("subject")} /></div>
                <div className="col-md-3"><label className="form-label fw-semibold" htmlFor="locationSearch">📍 Location</label><input className="form-control" id="locationSearch" placeholder="e.g. Hyderabad" value={form.location} onChange={update("location")} /></div>
                <div className="col-md-3"><label className="form-label fw-semibold" htmlFor="availabilitySearch">🕐 Availability</label><select className="form-select" id="availabilitySearch" value={form.availability} onChange={update("availability")}><option value="">Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Weekend</option></select></div>
                <div className="col-md-2 d-grid"><button className="btn btn-primary fw-semibold" type="submit"><i className="bi bi-search me-2" />Search</button></div>
              </div>
            </form>
          </div>
        </section>

        <section className="mb-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-3">
            <div><span className="tf-section-label">Available tutors</span><h2 className="h3 fw-bold mt-1 mb-0">Recommended Tutors</h2></div>
            <p className="text-secondary small mb-0">Choose a tutor based on your requirements.</p>
          </div>
          <div className="row g-4">
            {results.length === 0 ? <div className="col-12"><div className="card tf-soft-card"><div className="tf-empty"><div className="display-5">🔍</div><h3 className="h5 fw-bold text-dark mt-3">No Tutors Found</h3><p className="mb-0">Try changing your subject or location.</p></div></div></div> :
              results.map((tutor) => (
                <div className="col-md-6 col-xl-4" key={tutor.id}>
                  <article className="card tf-soft-card h-100">
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex align-items-center gap-3 mb-3"><div className="tf-icon-box bg-primary-subtle">👨‍🏫</div><div><h3 className="h5 fw-bold mb-1">{tutor.name}</h3><span className="badge text-bg-warning">⭐ {tutor.rating || "New"}</span></div></div>
                      <ul className="list-unstyled small text-secondary d-grid gap-2 mb-4">
                        <li><i className="bi bi-book me-2 text-primary" /><strong className="text-dark">Subject:</strong> {tutor.subject}</li>
                        <li><i className="bi bi-mortarboard me-2 text-primary" /><strong className="text-dark">Qualification:</strong> {tutor.qualification || "Not specified"}</li>
                        <li><i className="bi bi-briefcase me-2 text-primary" /><strong className="text-dark">Experience:</strong> {tutor.experience || "Not specified"}</li>
                        <li><i className="bi bi-geo-alt me-2 text-primary" /><strong className="text-dark">Location:</strong> {tutor.location || "Not specified"}</li>
                        <li><i className="bi bi-currency-rupee me-2 text-primary" /><strong className="text-dark">Fee:</strong> ₹{tutor.fee}/hour</li>
                        <li><i className="bi bi-clock me-2 text-primary" /><strong className="text-dark">Availability:</strong> {tutor.availability || "Not specified"}</li>
                      </ul>
                      <div className="d-flex gap-2 mt-auto">
                        <button className="btn btn-outline-primary flex-fill" onClick={() => navigate(`/tutors/${tutor.id}`)}>View Profile</button>
                        <button className="btn btn-primary flex-fill" onClick={() => handleRequest(tutor)}>Send Request</button>
                      </div>
                    </div>
                  </article>
                </div>
              ))
            }
          </div>
        </section>

        <section id="my-requests" className="scroll-mt">
          <div className="mb-3"><span className="tf-section-label">Request management</span><h2 className="h3 fw-bold mt-1 mb-0">My Tutor Requests</h2><p className="text-secondary mb-0">Track the status of your tutor requests.</p></div>
          <div className="card tf-soft-card border-0">
            {requests.length === 0 ? <div className="tf-empty"><div className="display-5">📩</div><h3 className="h5 fw-bold text-dark mt-3">No Requests Yet</h3><p className="mb-0">Send a request to a tutor to see it here.</p></div> :
              <div className="list-group list-group-flush rounded-4">
                {[...requests].reverse().map((request) => (
                  <div className="list-group-item p-3 p-md-4" key={request.id}>
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div><h3 className="h6 fw-bold mb-1">👨‍🏫 {request.tutorName}</h3><p className="small text-secondary mb-1">📚 {request.subject}</p><small className="text-secondary">Requested: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "Date unavailable"}</small>{request.message && <p className="small mt-2 mb-0">Message: {request.message}</p>}</div>
                      <div><span className={statusClass(request.status)}>{request.status || "pending"}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </section>
      </main>
      <StudentFooter />
    </>
  );
}
