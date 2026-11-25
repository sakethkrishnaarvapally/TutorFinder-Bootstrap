import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUsers } from "../utils/storage.js";
import { sampleTutors } from "../data/tutors.js";
import { sendTutorRequest } from "../utils/requests.js";
import StudentNavbar from "../components/StudentNavbar.jsx";
import StudentFooter from "../components/StudentFooter.jsx";

export default function TutorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const registeredTutors = getUsers().filter((u) => u.role?.toLowerCase() === "tutor" && ["approved", "active"].includes(u.status?.toLowerCase()));
  const tutor = [...sampleTutors, ...registeredTutors].find((t) => String(t.id ?? t._id) === id);

  function handleRequest() {
    const result = sendTutorRequest(tutor, user);
    window.alert(result.message);
  }

  return (
    <>
      <StudentNavbar />
      <main className="container py-5">
        <Link to="/student" className="btn btn-link px-0 mb-3"><i className="bi bi-arrow-left me-2" />Back to tutors</Link>
        {!tutor ? (
          <div className="card tf-soft-card"><div className="tf-empty"><div className="display-5">🔎</div><h2 className="h4 fw-bold text-dark mt-3">Tutor not found</h2><p className="mb-0">This tutor may have been removed.</p></div></div>
        ) : (
          <div className="card tf-soft-card border-0 overflow-hidden">
            <div className="card-body p-4 p-lg-5">
              <div className="row g-4 align-items-start">
                <div className="col-md-3 text-center"><div className="display-1 bg-primary-subtle rounded-4 p-4">👨‍🏫</div></div>
                <div className="col-md-9">
                  <div className="d-flex flex-wrap justify-content-between gap-2"><div><h1 className="h2 fw-bold mb-1">{tutor.name}</h1><span className="badge text-bg-warning">⭐ {tutor.rating || "New"}</span></div><div className="rounded-3 bg-primary-subtle text-primary px-4 py-3 text-center"><div className="small">Hourly fee</div><div className="fs-2 fw-bold">₹{tutor.fee || 0}</div></div></div>
                  <hr className="my-4" />
                  <div className="row g-3">
                    {[
                      ["Subject", tutor.subject, "bi-book"],
                      ["Qualification", tutor.qualification, "bi-mortarboard"],
                      ["Experience", tutor.experience, "bi-briefcase"],
                      ["Location", tutor.location, "bi-geo-alt"],
                      ["Availability", tutor.availability, "bi-clock"],
                    ].map(([label, value, icon]) => <div className="col-sm-6" key={label}><div className="border rounded-3 p-3 h-100"><div className="small text-secondary"><i className={`bi ${icon} me-2`} />{label}</div><strong>{value || "Not specified"}</strong></div></div>)}
                  </div>
                  <button className="btn btn-primary btn-lg mt-4" onClick={handleRequest}><i className="bi bi-send me-2" />Send Request</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <StudentFooter />
    </>
  );
}
